import React, { useState } from "react";

export default function Settings({
  handleAmount,
  handleCategory,
  handleDifficulty,
  qParam,
  showQParam,
}) {
  return (
    <div className="settings-div" >
      {showQParam && (
        <form
          onSubmit={function (event) {
            event.preventDefault();
          }}
        >
          <select onChange={handleAmount} id="select-amount">
          {[...Array(11).keys()].map(n => (
            <option key={n + 10} value={n + 10}>{n + 10}</option>
          ))}
          </select>
          <select onChange={handleCategory} id="select-category">
            <option value="28">General Knowledge</option>
            <option value="11">Film</option>
            <option value="14">Television</option>
            <option value="22">Geography</option>
            <option value="28">Vehicles</option>
            <option value="23">History</option>
            <option value="15">Video Games</option>
            <option value="12">Music</option>
            <option value="24">Politics</option>
            <option value="27">Animals</option>
            <option value="26">Celebrities</option>
            <option value="25">Art</option>
            <option value="21">Sports</option>
            <option value="18">Computer Science</option>
            <option value="31">Anime & Manga</option>
          </select>
          <select onChange={handleDifficulty} id="select-difficulty">
            <option value="">Any Difficulty</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

         
        </form>
      )}
      
    </div>
  );
}
