import '../styles/CourseCard.css'

const CourseCard = ({ title, description, image, onClick }) => {
  const backgroundStyle = {
    backgroundImage: image ? `url(${image})` : `url("/fallback.jpg")`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "220px",
  };

  return (
    <div className="card-landing" onClick={onClick}>
      <div className="card-img" style={backgroundStyle}></div>
      <div className="card-content">
        <h2 className="h2-card">
          <strong>{title}</strong>
        </h2>
        <p>{description}</p>
        <button className="play-button" aria-label="Play"></button>
      </div>
    </div>
  );
};
export default CourseCard
