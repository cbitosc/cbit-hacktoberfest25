import '../styles/ProbStatements.css'
import { useEffect } from 'react';

function ProbStatements() {

  useEffect(() => {
    const detailItems = document.querySelectorAll('.prob-button');
    
    // Function to check if element is in viewport
    function isInViewport(element) {
      const rect = element.getBoundingClientRect();
      return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
        rect.bottom >= 0
      );
    }
    
    // Function to handle scroll event
    function handleScroll() {
      detailItems.forEach(item => {
        if (isInViewport(item)) {
          item.classList.add('visible');
        }
      });
    }
    
    // Initial check on page load
    handleScroll();
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Clean up the event listener when component unmounts
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section id="ProbStatements" className="prob-section">
      <div className="prob-container">
        <h2>Released</h2>
        <p className="prob-subtitle">Problem statements will release soon</p>
        <div className="prob-actions">
        <a class="prob-button" href="#"><span>VIEW PROBLEM STATEMENTS</span></a>

        </div>
      </div>
    </section>
  )
}

export default ProbStatements
