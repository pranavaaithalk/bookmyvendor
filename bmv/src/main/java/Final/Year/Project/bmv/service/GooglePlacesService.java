package Final.Year.Project.bmv.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import Final.Year.Project.bmv.dto.VendorServiceDto;

import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

@Service
public class GooglePlacesService {

    @Value("${GOOGLE_PLACES_API_KEY:}")
    private String apiKey;

    private final RestTemplate rest = new RestTemplate();
    private final ConcurrentMap<Long, String> vendorIdToPlaceId = new ConcurrentHashMap<>();

    public GooglePlacesService() {
        // ensure RestTemplate can accept String responses
        rest.getMessageConverters().add(new StringHttpMessageConverter(StandardCharsets.UTF_8));
    }

    /**
     * Search Google Places Text Search for a service near a city. Returns simple VendorServiceDto entries
     * (with many fields null) sorted by rating and user_ratings_total. Does not call Photos API.
     */
    public List<VendorServiceDto> searchPlacesForService(String serviceName, String city, int limit) {
        List<VendorServiceDto> out = new ArrayList<>();
        if (apiKey == null || apiKey.isBlank()) return out;

        try {
            String query = URLEncoder.encode(serviceName + " " + city, StandardCharsets.UTF_8);
            String url = "https://maps.googleapis.com/maps/api/place/textsearch/json?query=" + query + "&key=" + apiKey;
            Map<?,?> resp = rest.getForObject(url, Map.class);
            if (resp == null || !resp.containsKey("results")) return out;
            List<?> results = (List<?>) resp.get("results");

            // Map results into simple DTO container with rating and review count
            List<Map<String,Object>> mapped = new ArrayList<>();
            for (Object o : results) {
                if (!(o instanceof Map)) continue;
                @SuppressWarnings("unchecked") Map<String,Object> m = (Map<String,Object>) o;
                mapped.add(m);
            }

            // Sort by rating desc then user_ratings_total desc
            mapped.sort(Comparator.<Map<String,Object>, Double>comparing(m -> {
                Object r = m.get("rating");
                return r instanceof Number ? ((Number) r).doubleValue() : 0.0;
            }).reversed().thenComparing(m -> {
                Object u = m.get("user_ratings_total");
                return u instanceof Number ? ((Number) u).intValue() : 0;
            }, Comparator.reverseOrder()));

            int added = 0;
            for (Map<String,Object> r : mapped) {
                if (added >= limit) break;

                String name = r.getOrDefault("name", "").toString();
                String address = r.containsKey("formatted_address")
                        ? r.get("formatted_address").toString()
                        : r.getOrDefault("vicinity", "").toString();

                Double rating = null;
                Object rv = r.get("rating");
                if (rv instanceof Number) rating = ((Number) rv).doubleValue();

                // Photo logic (same as before)
                String photoUrl = null;
                if (r.containsKey("photos") && r.get("photos") instanceof List) {
                    List<?> photos = (List<?>) r.get("photos");
                    if (!photos.isEmpty() && photos.get(0) instanceof Map) {
                        @SuppressWarnings("unchecked")
                        Map<String,Object> p = (Map<String,Object>) photos.get(0);
                        Object pref = p.get("photo_reference");
                        if (pref != null) {
                            String photoRef = pref.toString();
                            photoUrl = "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference="
                                    + URLEncoder.encode(photoRef, StandardCharsets.UTF_8)
                                    + "&key=" + apiKey;
                        }
                    }
                }
                String icon = r.containsKey("icon") ? r.get("icon").toString() : null;
                if (photoUrl == null) photoUrl = icon;

                // place_id
                Object pid = r.get("place_id");
                if (pid == null) continue;
                String placeId = pid.toString();

                String phone = getPhoneForPlaceId(placeId);

                if (phone == null) continue;

                String cleaned = phone.replaceAll("[^0-9]", "");

                // remove country code (India +91)
                if (cleaned.startsWith("91") && cleaned.length() > 10) {
                    cleaned = cleaned.substring(cleaned.length() - 10);
                }

                // 🔥 VALIDATION: ONLY 10 digit mobile
                if (cleaned.length() != 10) {
                    continue; // skip landlines or invalid numbers
                }

                // generate vendor id
                Long vendorUniqueId = makeVendorId(placeId);
                vendorIdToPlaceId.put(vendorUniqueId, placeId);

                VendorServiceDto dto = new VendorServiceDto(
                        null,
                        null,
                        name,
                        address,
                        null,
                        null,
                        null,
                        null,
                        true,
                        name,
                        rating != null ? BigDecimal.valueOf(rating) : BigDecimal.ZERO,
                        city,
                        vendorUniqueId,
                        photoUrl,
                        placeId
                );

                out.add(dto);
                added++;
            }

        } catch (Exception ex) {
            // swallow exceptions and return what we have
            System.err.println("GooglePlacesService error: " + ex.getMessage());
        }

        return out;
    }

    /**
     * Given a vendorUniqueId (as generated for Google vendors), fetch phone number via Place Details API.
     * Returns formatted_phone_number or international_phone_number if available, otherwise null.
     */
    public String getPhoneForVendorUniqueId(Long vendorUniqueId) {
        if (vendorUniqueId == null) return null;
        String placeId = vendorIdToPlaceId.get(vendorUniqueId);
        if (placeId == null || placeId.isBlank()) return null;
        try {
            String url = "https://maps.googleapis.com/maps/api/place/details/json?place_id="
                    + URLEncoder.encode(placeId, StandardCharsets.UTF_8)
                    + "&fields=formatted_phone_number,international_phone_number&key=" + apiKey;
            Map<?,?> resp = rest.getForObject(url, Map.class);
            if (resp == null || !resp.containsKey("result")) return null;
            Object result = resp.get("result");
            if (!(result instanceof Map)) return null;
            @SuppressWarnings("unchecked") Map<String,Object> m = (Map<String,Object>) result;
            Object phone = m.get("international_phone_number");
            if (phone == null) phone = m.get("formatted_phone_number");
            if (phone != null) return phone.toString();
        } catch (Exception ex) {
            System.err.println("GooglePlacesService details error: " + ex.getMessage());
        }
        return null;
    }

    /**
     * Fetch phone for a given Google place_id. Also registers the mapping to a generated vendor unique id.
     */
    public String getPhoneForPlaceId(String placeId) {
        if (placeId == null || placeId.isBlank()) return null;
        try {
            String url = "https://maps.googleapis.com/maps/api/place/details/json?place_id="
                    + URLEncoder.encode(placeId, StandardCharsets.UTF_8)
                    + "&fields=formatted_phone_number,international_phone_number&key=" + apiKey;
            Map<?,?> resp = rest.getForObject(url, Map.class);
            if (resp == null || !resp.containsKey("result")) return null;
            Object result = resp.get("result");
            if (!(result instanceof Map)) return null;
            @SuppressWarnings("unchecked") Map<String,Object> m = (Map<String,Object>) result;
            Object phone = m.get("international_phone_number");
            if (phone == null) phone = m.get("formatted_phone_number");
            // register mapping so vendorUniqueId can be resolved later
            Long vid = makeVendorId(placeId);
            if (vid != null) vendorIdToPlaceId.putIfAbsent(vid, placeId);
            if (phone != null){
                System.out.println("\n\nGooglePlacesService got phone for place_id " + placeId + ": " + phone.toString() + "\n\n");
                String cleaned = phone.toString().replaceAll("[^0-9]", "");

                if (cleaned.startsWith("91") && cleaned.length() > 10) {
                    cleaned = cleaned.substring(cleaned.length() - 10);
                }

                // 🔥 VALIDATION: ONLY 10 digit mobile
                if (cleaned.length() == 10) {
                    return "+91"+cleaned;
                }
            }
        } catch (Exception ex) {
            System.err.println("GooglePlacesService details error: " + ex.getMessage());
        }
        return null;
    }

    private Long makeVendorId(String placeId) {
        try {
            if (placeId == null) return null;
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(placeId.getBytes(StandardCharsets.UTF_8));
            long val = 0L;
            for (int i = 0; i < 8; i++) {
                val = (val << 8) | (hash[i] & 0xffL);
            }
            // ensure negative (to avoid colliding with positive DB auto-ids)
            val |= 0x8000000000000000L;
            return val;
        } catch (Exception ex) {
            // fallback to stable negative id using hashCode
            int hc = Objects.hashCode(placeId);
            long v = -Math.abs((long) hc);
            return v == 0 ? -1L : v;
        }
    }
}

