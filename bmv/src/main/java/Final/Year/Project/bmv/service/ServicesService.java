package Final.Year.Project.bmv.service;

import Final.Year.Project.bmv.entity.Services;
import Final.Year.Project.bmv.repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ServicesService {

    @Autowired
    private ServiceRepository servicesRepository;

    public Services createService(Services service) {
        return servicesRepository.save(service);
    }

    public List<Services> getAllServices() {
        return servicesRepository.findAll();
    }

    public Services getServiceById(Long id) {
        return servicesRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found: " + id));
    }

    public Services updateService(Long id, Services serviceDetails) {
        Services existing = getServiceById(id);
        existing.setName(serviceDetails.getName());
        existing.setDescription(serviceDetails.getDescription());
        existing.setIconUrl(serviceDetails.getIconUrl());
        existing.setActive(serviceDetails.isActive());
        return servicesRepository.save(existing);
    }

    public void deleteService(Long id) {
        servicesRepository.deleteById(id);
    }
}
