package Final.Year.Project.bmv.service;

import Final.Year.Project.bmv.entity.UserAddress;
import Final.Year.Project.bmv.repository.UserAddressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserAddressService {

    @Autowired
    private UserAddressRepository userAddressRepository;

    public UserAddress createUserAddress(UserAddress userAddress) {
        return userAddressRepository.save(userAddress);
    }

    public List<UserAddress> getAllUserAddresses() {
        return userAddressRepository.findAll();
    }

    public UserAddress getUserAddressById(Long id) {
        return userAddressRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("UserAddress not found: " + id));
    }

    public UserAddress updateUserAddress(Long id, UserAddress userAddressDetails) {
        UserAddress existing = getUserAddressById(id);
        existing.setUser(userAddressDetails.getUser());
        existing.setAddressType(userAddressDetails.getAddressType());
        existing.setAddressLine1(userAddressDetails.getAddressLine1());
        existing.setAddressLine2(userAddressDetails.getAddressLine2());
        existing.setCity(userAddressDetails.getCity());
        existing.setState(userAddressDetails.getState());
        existing.setCountry(userAddressDetails.getCountry());
        existing.setPincode(userAddressDetails.getPincode());
        existing.setDefault(userAddressDetails.isDefault());
        existing.setUpdatedAt(userAddressDetails.getUpdatedAt());
        return userAddressRepository.save(existing);
    }

    public void deleteUserAddress(Long id) {
        userAddressRepository.deleteById(id);
    }
}
