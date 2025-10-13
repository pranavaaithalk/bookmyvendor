package Final.Year.Project.bmv.service;

import Final.Year.Project.bmv.entity.Users;
import Final.Year.Project.bmv.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsersService {

    @Autowired
    private UserRepository usersRepository;

    public Users createUser(Users user) {
        return usersRepository.save(user);
    }

    public List<Users> getAllUsers() {
        return usersRepository.findAll();
    }

    public Users getUserById(Long id) {
        return usersRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found: " + id));
    }

    public Users updateUser(Long id, Users userDetails) {
        Users existing = getUserById(id);
        existing.setEmail(userDetails.getEmail());
        existing.setPasswordHash(userDetails.getPasswordHash());
        existing.setFirstName(userDetails.getFirstName());
        existing.setLastName(userDetails.getLastName());
        existing.setPhone(userDetails.getPhone());
        existing.setProfileImageUrl(userDetails.getProfileImageUrl());
        existing.setUserType(userDetails.getUserType());
        existing.setVerified(userDetails.isVerified());
        existing.setUpdatedAt(userDetails.getUpdatedAt());
        return usersRepository.save(existing);
    }

    public void deleteUser(Long id) {
        usersRepository.deleteById(id);
    }
}
