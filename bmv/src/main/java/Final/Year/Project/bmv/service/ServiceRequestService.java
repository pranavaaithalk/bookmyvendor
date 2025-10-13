package Final.Year.Project.bmv.service;

import Final.Year.Project.bmv.entity.ServiceRequest;
import Final.Year.Project.bmv.repository.ServiceRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ServiceRequestService {

    @Autowired
    private ServiceRequestRepository serviceRequestsRepository;

    public ServiceRequest createServiceRequest(ServiceRequest serviceRequest) {
        return serviceRequestsRepository.save(serviceRequest);
    }

    public List<ServiceRequest> getAllServiceRequests() {
        return serviceRequestsRepository.findAll();
    }

    public ServiceRequest getServiceRequestById(Long id) {
        return serviceRequestsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ServiceRequest not found: " + id));
    }

    public ServiceRequest updateServiceRequest(Long id, ServiceRequest serviceRequestDetails) {
        ServiceRequest existing = getServiceRequestById(id);
        existing.setEvent(serviceRequestDetails.getEvent());
        existing.setService(serviceRequestDetails.getService());
        existing.setBudgetMin(serviceRequestDetails.getBudgetMin());
        existing.setBudgetMax(serviceRequestDetails.getBudgetMax());
        existing.setGuestCount(serviceRequestDetails.getGuestCount());
        existing.setEventDate(serviceRequestDetails.getEventDate());
        existing.setRequirements(serviceRequestDetails.getRequirements());
        existing.setStatus(serviceRequestDetails.getStatus());
        existing.setUpdatedAt(serviceRequestDetails.getUpdatedAt());
        return serviceRequestsRepository.save(existing);
    }

    public void deleteServiceRequest(Long id) {
        serviceRequestsRepository.deleteById(id);
    }
}
