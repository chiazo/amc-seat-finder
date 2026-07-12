import { useEffect, useState } from "react";
import { fetchTheatreData, fetchAllMovieData, fetchIndividualMovieData } from "./api/index.js";
import { TheatreSelector } from "./TheatreSelector.jsx";

const App = () => {
  const [theatreCollection, setTheatreCollection] = useState(null);
  const [movieData, setMovieData] = useState(null);
  const [theatre, setTheatre] = useState(null);

  useEffect(() => {
    fetchTheatreData().then((d) => {
      setTheatreCollection(d);
    });
  }, []);

  if (!theatreCollection) {
    return <div>Loading theatres…</div>;
  }

  return (
    <div className="home">
      <div className="content">
        <TheatreSelector
          getStates={() => [...new Set(theatreCollection.states)]}
          getCities={({ state }) => [
            ...new Set(theatreCollection.byState(state).map((t) => t.city)),
          ]}
          getChains={({ state, city }) => [
            ...new Set(
              theatreCollection
                .byState(state)
                .filter((t) => t.city === city)
                .map((t) => t.chain),
            ),
          ]}
          getTheatres={({ state, city, chain }) =>
            theatreCollection.theatres
              .filter(
                (t) =>
                  t.state === state && t.city === city && t.chain === chain,
              )
              .map((t) => t.name)
          }
          getFormats={({ theatre }) =>
            theatreCollection.byName(theatre)?.formats ?? []
          }
          theatreCollection={theatreCollection}
          onChange={(selection) => console.log(selection)}
        />
      </div>
    </div>
  );
};

export default App;
