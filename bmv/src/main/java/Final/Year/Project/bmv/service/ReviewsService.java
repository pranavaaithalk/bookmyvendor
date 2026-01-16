package Final.Year.Project.bmv.service;

import Final.Year.Project.bmv.entity.Reviews;
import Final.Year.Project.bmv.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewsService {

    @Autowired
    private ReviewRepository reviewsRepository;

    public Reviews createReview(Reviews review) {
        return reviewsRepository.save(review);
    }

    public List<Reviews> getAllReviews() {
        return reviewsRepository.findAll();
    }

    public Reviews getReviewById(Long id) {
        return reviewsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found: " + id));
    }

    public Reviews updateReview(Long id, Reviews reviewDetails) {
        Reviews existing = getReviewById(id);
        existing.setBooking(reviewDetails.getBooking());
        existing.setClient(reviewDetails.getClient());
        existing.setVendor(reviewDetails.getVendor());
        existing.setRating(reviewDetails.getRating());
        existing.setTitle(reviewDetails.getTitle());
        existing.setComment(reviewDetails.getComment());
        existing.setApproved(reviewDetails.isApproved());
        existing.setUpdatedAt(reviewDetails.getUpdatedAt());
        return reviewsRepository.save(existing);
    }

    public void deleteReview(Long id) {
        reviewsRepository.deleteById(id);
    }

    public List<Reviews> getReviewsByVendor(Long vid){
        return reviewsRepository.findByVendor_UserId(vid);
    }
}
