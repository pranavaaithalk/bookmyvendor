package Final.Year.Project.bmv.controller;

import Final.Year.Project.bmv.dto.UserDto;
import Final.Year.Project.bmv.entity.Users;
import Final.Year.Project.bmv.entity.VendorProfile;
import Final.Year.Project.bmv.service.UsersService;
import Final.Year.Project.bmv.service.VendorProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UsersController {

    @Autowired
    private UsersService usersService;

    @Autowired
    VendorProfileService vendorProfileService;

    // Login API --> expects map with keys: "email", "passwordHash"
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> map) {
        // authentication logic placeholder
        String email = map.get("email");
        String passwordHash = map.get("passwordHash");
        Users user = usersService.getUserByEmail(email);
        if (user !=null && user.getPasswordHash().equals(passwordHash)) {
            Long vid = (long)-1;
            VendorProfile vendor = vendorProfileService.getVendorByUserId(user.getUserId());
            if(vendor != null){
                vid = vendor.getVendorId();
            }
            return ResponseEntity.ok(Map.of("name",user.getFirstName(),"userType",user.getUserType().toString().toLowerCase(),"userId",user.getUserId(),"vendorId",vid));
        }
        return ResponseEntity.status(401).body("Invalid credentials");
    }

    // Signup API --> map for user fields like email, passwordHash, ...
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Map<String, String> map) {
        System.out.println(map);
        Users user = Users.builder()
                .email(map.get("email"))
                .passwordHash(map.get("passwordHash"))
                .firstName(map.get("firstName"))
                .lastName(map.get("lastName"))
                .phone(map.get("phone"))
                .userType(Users.UserType.valueOf(map.get("userType").toUpperCase()))
                .build();
        Users created = usersService.createUser(user);
        return ResponseEntity.ok(Map.of("name",created.getFirstName(),"userType",created.getUserType().toString().toLowerCase(),"id",created.getUserId()));
    }

    // Update profile --> map with user fields to update
    @PutMapping("/{userId}")
    public ResponseEntity<Users> updateUser(@PathVariable Long userId, @RequestBody Map<String, String> map) {
        Users user = usersService.getUserById(userId);
        if (map.containsKey("email")) user.setEmail(map.get("email"));
        if (map.containsKey("passwordHash")) user.setPasswordHash(map.get("passwordHash"));
        if (map.containsKey("firstName")) user.setFirstName(map.get("firstName"));
        if (map.containsKey("lastName")) user.setLastName(map.get("lastName"));
        if (map.containsKey("phone")) user.setPhone(map.get("phone"));
        if (map.containsKey("profileImageUrl")) user.setProfileImageUrl(map.get("profileImageUrl"));
        if (map.containsKey("userType")) user.setUserType(Users.UserType.valueOf(map.get("userType").toUpperCase()));
        user.setUpdatedAt(java.time.LocalDateTime.now());
        return ResponseEntity.ok(usersService.updateUser(userId, user));
    }

    @GetMapping
    public ResponseEntity<List<Users>> getAllUsers() {
        return ResponseEntity.ok(usersService.getAllUsers());
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long userId) {
        Users au = usersService.getUserById(userId);
        UserDto us = UserDto.from(au);
        return ResponseEntity.ok(us);
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
        usersService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }
}
