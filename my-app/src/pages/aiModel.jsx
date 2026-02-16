import { useState } from "react";
import "../css/aiModel.css"; 
import image1 from '../../public/images/1.png';
import image2 from '../../public/images/2.png';
import image3 from '../../public/images/3.png';
import image4 from '../../public/images/4.png';
import { Link } from "react-router-dom";
// Using the CSS we created earlier

// Changed component name to start with capital letter (React convention)
export default function AiModel() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <div className="app-container">
     

      <div className="main-content-wrapper">
       

        {/* Main content */}
        <main className={`content-area ${isSidebarOpen ? "with-sidebar" : ""}`}>
          <div className="content-header">
            <div className="banner d-flex justify-content-between" style={{width : "85vw"}}>
        <div className="align-content-center m-4">
          <span className="bannerTitle">AI Model</span>
          <div className="breadcrumbs d-flex mt-1">
            <Link to="/dashboard">Home</Link>
            <div className="d-flex align-items-center ms-2">
              <i style={{ fontSize: "6px" }} className="bi bi-circle-fill"></i>
              <span className="ms-2">AI Model</span>
            </div>
          </div>
        </div>
        <img
          src="https://blog.planview.com/wp-content/uploads/2025/03/iStock-2160690793-Converted_1200x680.jpg"
          style={{ width: "15%", marginRight: "3%" }}
        />
      </div>
            <span></span>
            
          </div>
          
          {/* Image grid */}
          <div className="image-container">
            <section className="image-grid-section">
              <div className="image-grid">
                <div className="grid-item">
                  <img 
                    src={image1}
                    alt="Image 1" 
                    className="grid-image" 
                  />
                </div>
                <div className="grid-item">
                  <img 
                    src={image2}
                    alt="Image 2" 
                    className="grid-image" 
                  />
                </div>
                <div className="grid-item">
                  <img 
                    src={image3}
                    alt="Image 3" 
                    className="grid-image" 
                  />
                </div>
                <div className="grid-item">
                  <img 
                    src={image4}
                    alt="Image 4" 
                    className="grid-image" 
                  />
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}