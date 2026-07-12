import { useEffect, useState } from "react";
import { fetchAllMovieData, fetchIndividualMovieData } from "./api/index.js";
import Movie from "./code/movie.js";

function useOptions(getter, deps) {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    let cancelled = false;
    Promise.resolve(getter ? getter(deps) : []).then((result) => {
      if (!cancelled) setOptions(result ?? []);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getter, JSON.stringify(deps)]);

  return options;
}

export const TheatreSelector = ({
  getStates,
  getCities,
  getChains,
  getTheatres,
  getFormats,
  onChange,
  theatreCollection,
}) => {
  const [state, setState] = useState("NY");
  const [city, setCity] = useState("NYC");
  const [chain, setChain] = useState("AMC");
  const [theatre, setTheatre] = useState("AMC Lincoln Square 13");
  const [format, setFormat] = useState("");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [allMoviesData, setAllMoviesData] = useState([]);
  const [movieData, setMovieData] = useState([]);
  const [bestSeats, setBestSeats] = useState([])

  const states = useOptions(getStates, {});
  const cities = useOptions(getCities, { state });
  const chains = useOptions(getChains, { state, city });
  const theatres = useOptions(getTheatres, { state, city, chain });
  const formats = useOptions(getFormats, { state, city, chain, theatre });

  const availableFormats =
    movieData && movieData.showtimes
      ? [...new Set(movieData.showtimes.map((s) => s.format))]
      : formats;

  useEffect(() => {
    onChange?.({ state, city, chain, theatre, format, startDate });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, city, chain, theatre, format, startDate]);

  useEffect(() => {
    if (!theatre || !startDate) return;

    fetchAllMovieData(theatreCollection.byName(theatre).id, startDate).then(
      (data) => {
        console.log("movie data", data);
        setAllMoviesData(data);
      },
    );
  }, [theatre, startDate]);

  useEffect(() => {
    if (!movieData) return;
    fetchIndividualMovieData(
      movieData,
      format,
      startDate,
      theatreCollection.byName(theatre).id,
    ).then((data) => {
        console.log("wowza", data);
        setBestSeats(data)
    });
  }, [movieData]);

  return (
    <div>
      <label>
        <div>State</div>
        <select
          value={state}
          onChange={(e) => {
            setState(e.target.value);
            setCity("");
            setChain("");
            setTheatre("");
            setFormat("");
          }}
        >
          <option value="">Choose a state…</option>
          {states.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>

      <label>
        <div>City</div>
        <select
          value={city}
          disabled={!state}
          onChange={(e) => {
            setCity(e.target.value);
            setChain("");
            setTheatre("");
            setFormat("");
          }}
        >
          <option value="">Choose a city…</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>

      {chains.length > 0 && (
        <label>
          <div>Chain</div>
          <select
            value={chain}
            disabled={!city}
            onChange={(e) => {
              setChain(e.target.value);
              setTheatre("");
              setFormat("");
            }}
          >
            <option value="">Choose a chain…</option>
            {chains.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
      )}

      {theatres.length > 0 && (
        <label>
          <div>Theatre</div>
          <select
            value={theatre}
            disabled={!chain}
            onChange={(e) => {
              setTheatre(e.target.value);
              setFormat("");
            }}
          >
            <option value="">Choose a theatre…</option>
            {theatres.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
      )}

      {theatres.length > 0 && (
        <label>
          <div>Start Date</div>
          <input
            type="date"
            value={startDate}
            disabled={!chain}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
      )}

      {allMoviesData.length > 0 && (
        <label>
          <div>Movie</div>
          <select
            value={movieData.name}
            disabled={!theatre}
            onChange={(e) => {
              const movie = allMoviesData.find(
                (m) => m.name === e.target.value,
              );
              setMovieData(movie);
            }}
          >
            <option value="">Choose a movie...</option>
            {allMoviesData.map((m) => (
              <option key={m.name} value={m.name}>
                {m.name}
              </option>
            ))}
          </select>
        </label>
      )}

      {availableFormats.length > 0 && (
        <label>
          <div>Format</div>
          <select
            value={format}
            disabled={!theatre}
            onChange={(e) => setFormat(e.target.value)}
          >
            <option value="">Choose a format…</option>
            {availableFormats.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </label>
      )}
    </div>
  );
};

export default TheatreSelector;
