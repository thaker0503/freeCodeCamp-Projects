import React, { useEffect, useState } from "react";
import { FaQuoteLeft, FaTwitter, FaTumblr } from "react-icons/fa";
import { getQuotes } from "../api";
import { useQuery } from "@tanstack/react-query";

const QuoteWrapper = (props) => {
  const { styles, generateColor } = props;
  const [quotes, setQuotes] = useState([]);
  const [currrentQuote, setCurrentQuote] = useState({});

  const tweetQuote = () => {
    const tweetUrl = `https://twitter.com/intent/tweet?hashtags=quotes&related=freecodecamp&text=${encodeURIComponent(
      `"${currrentQuote.quote}" - ${currrentQuote.author}`
    )}`;
    window.open(tweetUrl, "_blank");
  };

  const tumblrQuote = () => {
    const tumblrUrl = `https://www.tumblr.com/widgets/share/tool?posttype=quote&tags=quotes,freecodecamp&caption=${encodeURIComponent(
      currrentQuote.author
    )}&content=${encodeURIComponent(
      currrentQuote.quote
    )}&canonicalUrl=https%3A%2F%2Fwww.tumblr.com%2Fbuttons&shareSource=tumblr_share_button`;
    window.open(tumblrUrl, "_blank");
  };

  function getRandomQuote() {
    console.log("quotes", quotes);
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    console.log("random quote", randomQuote);
    setCurrentQuote(randomQuote);
  }

  const { isLoading, isError, error } = useQuery(["quote"], async () => {
    const response = await getQuotes();
    setQuotes(response.quotes);
    return response;
  });

  useEffect(() => {
    if (quotes.length > 0) {
      getRandomQuote();
    }
  }, [quotes]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="bg-white w-[500px] h-max min-h-[300px] px-11 py-4 flex flex-col justify-evenly items-center rounded-md">
      <div>
        <FaQuoteLeft className="w-6 h-7" />
        <span id="text" className="text-3xl ">
          {currrentQuote.quote}
        </span>
      </div>
      <div className="w-full flex justify-end text-lg">
        <span id="author">- {currrentQuote.author}</span>
      </div>
      <div className="flex justify-between w-full items-center">
        <div className="flex items-center w-[21%] justify-between">
          <a
            id="tweet-quote"
            title="Tweet this quote!"
            className="w-10 h-10 cursor-pointer "
            target="_blank"
            onClick={() => {
              tweetQuote();
            }}
          >
            <FaTwitter
              className={`p-2 w-10 h-10 !text-white rounded-md`}
              style={styles}
            />
          </a>
          <a
            className="w-10 h-10 cursor-pointer"
            id="tumblr-quote"
            title="Post this quote on tumblr!"
            target="_blank"
            onClick={() => {
              tumblrQuote();
            }}
          >
            <FaTumblr
              className={`p-2 w-10 h-10 !text-white rounded-md`}
              style={styles}
            />
          </a>
        </div>
        <button
          className={`px-[18px] py-[8px] !text-white rounded-md`}
          id="new-quote"
          style={styles}
          onClick={() => {
            getRandomQuote();
            generateColor();
          }}
        >
          New quote
        </button>
      </div>
    </div>
  );
};

export default QuoteWrapper;
