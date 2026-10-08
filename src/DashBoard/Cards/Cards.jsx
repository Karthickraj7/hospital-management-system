import React from "react";
import "../Cards/Cards.css";  // Make sure the CSS file path is correct
import Data from "../../DashBoard/Data";  // Ensure this path is correct
import Card from "../Card/Card";  // Ensure this path is correct


const Cards = () => {
  return (
    <div className="Cards">
      {Data.map((card, id) => (
        <div className="parentContainer" key={id}>
          <Card
            title={card.title}
            color={card.color}
            png={card.png}
            series={card.series}
          />
        </div>
      ))}
    </div>
  );
};

export default Cards;
