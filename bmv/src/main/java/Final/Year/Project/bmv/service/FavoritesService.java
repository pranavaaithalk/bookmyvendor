package Final.Year.Project.bmv.service;

import Final.Year.Project.bmv.entity.Favorites;
import Final.Year.Project.bmv.repository.FavoriteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FavoritesService {

    @Autowired
    private FavoriteRepository favoritesRepository;

    public Favorites createFavorites(Favorites favorites) {
        return favoritesRepository.save(favorites);
    }

    public List<Favorites> getAllFavorites() {
        return favoritesRepository.findAll();
    }

    public Favorites getFavoritesById(Long id) {
        return favoritesRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Favorites not found: " + id));
    }

    public Favorites updateFavorites(Long id, Favorites favoritesDetails) {
        Favorites existing = getFavoritesById(id);
        existing.setUser(favoritesDetails.getUser());
        existing.setVendorService(favoritesDetails.getVendorService());
        return favoritesRepository.save(existing);
    }

    public void deleteFavorites(Long id) {
        favoritesRepository.deleteById(id);
    }
}
