/**
 *
 * Searching Keywords
 *
 */

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

const SearchKeywords = () => {
  const [keywordData, setKeywordData] = useState([]);

  const getData = async () => {
    const response = await axios.get(`/api/search`);
    if (response.data.success === true) {
      setKeywordData(response.data.data);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="review-dashboard">
      <div className="r-list">
        {keywordData?.map((item, index) => (
          <div key={index} className="review-box">
            <div className="mb-3 p-4">
              <div className="d-flex flex-row mx-0 mb-2 mb-lg-3 align-items-center justify-content-between">
                <div className="review-content">
                  <div className="d-flex flex-row mx-0 mb-2 align-items-center justify-content-between">
                    <p className="mb-0 fw-2 fs-16 text-truncate">
                      Keyword Name : {item.keywords}
                    </p>
                  </div>
                  <p className="mb-0 fw-1 fs-14 word-break-all">
                    How Many time search : {item.count}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchKeywords;
