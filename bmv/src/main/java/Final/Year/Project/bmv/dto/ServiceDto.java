package Final.Year.Project.bmv.dto;

public class ServiceDto {
    private Long serviceId;
    private String name;
    private String description;
    private String iconUrl;

    public ServiceDto() {}

    public ServiceDto(Long serviceId, String name, String description, String iconUrl) {
        this.serviceId = serviceId;
        this.name = name;
        this.description = description;
        this.iconUrl = iconUrl;
    }

    public Long getServiceId() { return serviceId; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public String getIconUrl() { return iconUrl; }

    public static ServiceDto from(Final.Year.Project.bmv.entity.Services s) {
        if (s == null) return null;
        return new ServiceDto(s.getServiceId(), s.getName(), s.getDescription(), s.getIconUrl());
    }
}
