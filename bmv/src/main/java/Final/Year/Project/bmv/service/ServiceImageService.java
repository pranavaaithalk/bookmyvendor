package Final.Year.Project.bmv.service;

import Final.Year.Project.bmv.entity.ServiceImage;
import Final.Year.Project.bmv.repository.ServiceImageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ServiceImageService {

    @Autowired
    private ServiceImageRepository serviceImageRepository;

    public ServiceImage createServiceImage(ServiceImage serviceImage) {
        return serviceImageRepository.save(serviceImage);
    }

    public List<ServiceImage> getAllServiceImages() {
        return serviceImageRepository.findAll();
    }

    public ServiceImage getServiceImageById(Long id) {
        return serviceImageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ServiceImage not found: " + id));
    }

    public ServiceImage updateServiceImage(Long id, ServiceImage serviceImageDetails) {
        ServiceImage existing = getServiceImageById(id);
        existing.setVendorService(serviceImageDetails.getVendorService());
        existing.setImageUrl(serviceImageDetails.getImageUrl());
        existing.setPrimary(serviceImageDetails.isPrimary());
        existing.setCaption(serviceImageDetails.getCaption());
        return serviceImageRepository.save(existing);
    }

    public void deleteServiceImage(Long id) {
        serviceImageRepository.deleteById(id);
    }
}
