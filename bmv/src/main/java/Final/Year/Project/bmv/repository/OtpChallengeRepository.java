package Final.Year.Project.bmv.repository;

import Final.Year.Project.bmv.entity.OtpChannel;
import Final.Year.Project.bmv.entity.OtpChallenge;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OtpChallengeRepository extends JpaRepository<OtpChallenge, Long> {

    Optional<OtpChallenge> findByDestinationAndChannel(String destination, OtpChannel channel);

    void deleteByDestinationAndChannel(String destination, OtpChannel channel);
}
