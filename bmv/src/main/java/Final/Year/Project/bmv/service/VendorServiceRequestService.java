package Final.Year.Project.bmv.service;

import Final.Year.Project.bmv.entity.VendorServiceRequest;
import Final.Year.Project.bmv.entity.VendorServiceRequest.Status;
import Final.Year.Project.bmv.repository.VendorServiceRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class VendorServiceRequestService {

    @Autowired
    private VendorServiceRequestRepository vendorServiceRequestRepository;

    public VendorServiceRequest createVendorServiceRequest(VendorServiceRequest vendorServiceRequest) {
        return vendorServiceRequestRepository.save(vendorServiceRequest);
    }

    public List<VendorServiceRequest> getAllVendorServiceRequests() {
        return vendorServiceRequestRepository.findAll();
    }

    public VendorServiceRequest getVendorServiceRequestById(Long id) {
        return vendorServiceRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("VendorServiceRequest not found: " + id));
    }

    public List<VendorServiceRequest> getRequestsForVendor(Long vendorId) {
        return vendorServiceRequestRepository.findByVendor_VendorId(vendorId);
    }

    public VendorServiceRequest updateVendorServiceRequest(Long id, VendorServiceRequest vendorServiceRequestDetails) {
        VendorServiceRequest existing = getVendorServiceRequestById(id);
        existing.setServiceRequest(vendorServiceRequestDetails.getServiceRequest());
        existing.setVendor(vendorServiceRequestDetails.getVendor());
        existing.setProposedAmount(vendorServiceRequestDetails.getProposedAmount());
        existing.setMessage(vendorServiceRequestDetails.getMessage());
        existing.setStatus(vendorServiceRequestDetails.getStatus());
        existing.setUpdatedAt(LocalDateTime.now());
        return vendorServiceRequestRepository.save(existing);
    }

    public void deleteVendorServiceRequest(Long id) {
        vendorServiceRequestRepository.deleteById(id);
    }

    // Fetch new (PENDING) vendor service requests for a specific vendor
    public List<VendorServiceRequest> getNewRequestsForVendor(Long vendorId) {
        return vendorServiceRequestRepository.findByVendor_VendorIdAndStatus(vendorId, Status.PENDING);
    }

    // Accept a vendor service request by updating status to ACCEPTED
    public boolean acceptRequest(Long vendorRequestId, Long vendorId) {
        Optional<VendorServiceRequest> optionalRequest = vendorServiceRequestRepository.findById(vendorRequestId);
        if (optionalRequest.isPresent()) {
            VendorServiceRequest request = optionalRequest.get();
            if (request.getVendor().getVendorId().equals(vendorId) && request.getStatus() == Status.PENDING) {
                request.setStatus(Status.ACCEPTED);
                request.setUpdatedAt(LocalDateTime.now());
                vendorServiceRequestRepository.save(request);
                return true;
            }
        }
        return false;
    }

    // Decline a vendor service request by updating status to REJECTED
    public boolean declineRequest(Long vendorRequestId, Long vendorId) {
        Optional<VendorServiceRequest> optionalRequest = vendorServiceRequestRepository.findById(vendorRequestId);
        if (optionalRequest.isPresent()) {
            VendorServiceRequest request = optionalRequest.get();
            if (request.getVendor().getVendorId().equals(vendorId) && request.getStatus() == Status.PENDING) {
                request.setStatus(Status.REJECTED);
                request.setUpdatedAt(LocalDateTime.now());
                vendorServiceRequestRepository.save(request);
                return true;
            }
        }
        return false;
    }
}
