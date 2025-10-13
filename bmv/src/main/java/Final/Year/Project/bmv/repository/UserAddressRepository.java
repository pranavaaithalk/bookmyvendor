package Final.Year.Project.bmv.repository;

import Final.Year.Project.bmv.entity.UserAddress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserAddressRepository extends JpaRepository<UserAddress, Long> {
}

