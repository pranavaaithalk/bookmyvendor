package Final.Year.Project.bmv.repository;

import Final.Year.Project.bmv.entity.VendorInvite;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface VendorInviteRepository extends JpaRepository<VendorInvite, Long> {

    Optional<VendorInvite> findByToken(String token);

    List<VendorInvite> findAllByStatusAndExpiresAtBefore(VendorInvite.Status status, LocalDateTime before);
}
