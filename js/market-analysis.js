document.addEventListener("DOMContentLoaded", function () {

  const feed = document.getElementById("analysisFeed");
  const title = document.getElementById("analysisTitle");
  const message = document.getElementById("analysisMessage");

  fetch("analysis.json", {
    cache: "no-store"
  })

    .then(response => {

      if (!response.ok) {
        throw new Error("Unable to load analysis.json");
      }

      return response.json();

    })

    .then(data => {

      /* PAGE INFORMATION */

      title.textContent = data.title || "Market Analysis";

      message.textContent =
        data.message || "Public market research and analysis.";


      /* CLEAR LOADING MESSAGE */

      feed.innerHTML = "";


      /* CHECK POSTS */

      if (!data.posts || data.posts.length === 0) {

        feed.innerHTML = `
          <div class="card">
            <h3>No analysis published yet.</h3>
            <p>
              New market analysis will appear here when published.
            </p>
          </div>
        `;

        return;
      }


      /* SORT NEWEST FIRST */

      const posts = [...data.posts].sort(
        (a, b) =>
          new Date(b.published_at) -
          new Date(a.published_at)
      );


      /* CREATE EACH POST */

      posts.forEach(post => {

        const card = document.createElement("article");

        card.className = "card analysis-card";


        /* FORMAT DATE */

        let formattedDate = post.published_at;

        try {

          const date = new Date(post.published_at);

          formattedDate = date.toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
            timeZone: "Asia/Kolkata"
          }) + " IST";

        } catch (error) {

          console.warn(
            "Unable to format publication date:",
            error
          );

        }


        /* BUILD CARD */

        card.innerHTML = `

          <div class="analysis-meta">

            <span class="badge">
              ${escapeHTML(post.symbol || "Market")}
            </span>

            <span>
              ${escapeHTML(post.timeframe || "")}
            </span>

          </div>


          <h3>
            ${escapeHTML(post.symbol || "Market Analysis")}
          </h3>


          <p class="small">
            Published:
            <strong>
              ${escapeHTML(formattedDate)}
            </strong>
          </p>


          <p>
            ${escapeHTML(post.body || "")}
          </p>


          ${
            post.chart
              ? `
                <div class="analysis-chart">

                  <img
                    src="${escapeAttribute(post.chart)}"
                    alt="${escapeAttribute(
                      (post.symbol || "Market") +
                      " market analysis chart"
                    )}"
                    loading="lazy"
                  >

                </div>
              `
              : ""
          }


          <div class="analysis-id">

            Analysis ID:
            <code>
              ${escapeHTML(post.id || "")}
            </code>

          </div>

        `;


        feed.appendChild(card);

      });

    })

    .catch(error => {

      console.error(error);

      feed.innerHTML = `

        <div class="card">

          <h3>
            Analysis temporarily unavailable
          </h3>

          <p>
            The market analysis feed could not be loaded
            at this time.
          </p>

        </div>

      `;

    });

});


/* SECURITY HELPERS */

function escapeHTML(value) {

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}


function escapeAttribute(value) {

  return escapeHTML(value);

}
