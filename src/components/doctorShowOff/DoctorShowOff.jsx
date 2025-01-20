import { useState, useEffect } from 'react';
import axios from 'axios';
import './DoctorShowOff.css'

const DoctorShowOff = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 2;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentFeedbacks = feedbacks.slice(
    indexOfFirstItem,
    indexOfLastItem
    );

  const totalPages = Math.ceil(feedbacks.length / itemsPerPage);

    const getHighRatingFeedbacks = async () => {
        try {
            const response = await axios.get(
              `${import.meta.env.VITE_API_URL}/feedback/find/doctors-highrating`,
              {
                withCredentials: true,
              }
            );
            setFeedbacks(response.data);
          } catch (error) {
            console.log("Catch error: " + error);
          }
    }

    const changeFeedbacks = () => {
        setCurrentPage((prevPage) => {
            if (prevPage === totalPages) {
                return 1;
            } else {
                return prevPage + 1;
            }
        })
    }

    useEffect(() => {
        getHighRatingFeedbacks();
        
    }, [])

    useEffect(() => {
        const interval = setInterval(changeFeedbacks, 5000);
        return () => clearInterval(interval);
    }, [feedbacks])
    
    return (
        <div className='showOffBox'>
            {currentFeedbacks.map((feedback, index) => (
                <div key={index} className={`showOffFeedback`}>
                    <h3 id='feedbackName' className='fContent'>{feedback.doctorFullName}</h3>
                    <p id='feedbackRating' className='fContent'><b>Rating:</b> {feedback.rating}</p>
                    <p id='feedbackComment' className='fContent'>{feedback.comment}</p>
                </div>
            ))}
        </div>
    )
}

export default DoctorShowOff;