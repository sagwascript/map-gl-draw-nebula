import React, { useState } from "react";
import DeckGL from "deck.gl";
import {
  EditableGeoJsonLayer,
  DrawPolygonMode,
  DrawPointMode,
  ModifyMode,
  TranslateMode,
  RotateMode,
  ScaleMode
} from "nebula.gl";
import ReactMapGL, { Marker } from "react-map-gl";
import MarkerIcon from "./map-marker.svg";

const TOKEN = "YOUR MAPBOX TOKEN";

function App() {
  const viewport = {
    longitude: 112.234539,
    latitude: -7.555437,
    zoom: 14
  };
  const style = "mapbox://styles/mapbox/satellite-streets-v10";
  const [selectedFeatureIndexes, setSelectedFeatureIndexes] = useState([]);
  const [data, setData] = useState({
    type: "FeatureCollection",
    features: []
  });
  const [mode, setMode] = useState(new DrawPolygonMode());

  let layers = [
    new EditableGeoJsonLayer({
      id: "geojson-layer",
      data,
      mode,
      selectedFeatureIndexes,
      lineJointRounded: true,
      getLineWidth: (feature, isSelected, mode) => {
        if (feature.geometry.type === "Polygon") return 2;
        else return 13;
      },
      getFillColor: feature =>
        feature.geometry.type !== "Point" ? [255, 0, 0, 205] : null,
      getLineColor: feature =>
        feature.geometry.type !== "Point" ? [255, 255, 255, 255] : null,
      getTentativeLineColor: _ => [255, 255, 255, 255],
      getTentativeFillColor: _ => [255, 0, 0, 205],
      getTentativeLineWidth: _ => 2,
      editHandlePointOutline: true,
      onEdit: ({ updatedData, editType }) => {
        setData(updatedData);
        setSelectedFeatureIndexes([0]);
        if (editType === "addFeature") setMode(new TranslateMode());
      }
    })
  ];

  return (
    <React.Fragment>
      <DeckGL initialViewState={viewport} layers={layers} controller={true}>
        <ReactMapGL mapboxApiAccessToken={TOKEN} mapStyle={style}>
          {data.features.length > 0 &&
            data.features[0].geometry.type === "Point" && (
              <Marker
                latitude={data.features[0].geometry.coordinates[1]}
                longitude={data.features[0].geometry.coordinates[0]}
                offsetLeft={-20}
                offsetTop={-10}
                draggable
              >
                <img
                  src={MarkerIcon}
                  style={{ height: 40, width: 40 }}
                  alt=""
                />
              </Marker>
            )}
        </ReactMapGL>
      </DeckGL>
      <div
        className="btn-group-vertical"
        style={{ position: "absolute", top: 10, left: 30 }}
      >
        {!data.features.length ? (
          <React.Fragment>
            <button
              className="btn btn-light"
              title="Gambar Area"
              onClick={() => setMode(new DrawPolygonMode())}
            >
              <i className="material-icons">format_shapes</i>
            </button>
            <button
              className="btn btn-light"
              title="Buat Titik"
              onClick={() => setMode(new DrawPointMode())}
            >
              <i className="material-icons">room</i>
            </button>
          </React.Fragment>
        ) : data.features.length === 1 &&
          data.features[0].geometry.type === "Polygon" ? (
          <React.Fragment>
            <button
              className="btn btn-light"
              title="Pindahkan Area/Titik"
              onClick={() => setMode(new TranslateMode())}
            >
              <i className="material-icons">open_with</i>
            </button>
            <button
              className="btn btn-light"
              title="Atur Rotasi"
              onClick={() => setMode(new RotateMode())}
            >
              <i className="material-icons">rotate_left</i>
            </button>
            <button
              className="btn btn-light"
              title="Atur Ukuran"
              onClick={() => setMode(new ScaleMode())}
            >
              <i className="material-icons">zoom_out_map</i>
            </button>
            <button
              className="btn btn-light"
              title="Ubah Bentuk"
              onClick={() => setMode(new ModifyMode())}
            >
              <i className="material-icons">edit</i>
            </button>
            <button
              className="btn btn-light"
              title="Hapus Area/Titik"
              onClick={() => setData({ ...data, features: [] })}
            >
              <i className="material-icons">delete_forever</i>
            </button>
          </React.Fragment>
        ) : (
          <button
            className="btn btn-light"
            title="Hapus Area/Titik"
            onClick={() => setData({ ...data, features: [] })}
          >
            <i className="material-icons">delete_forever</i>
          </button>
        )}
      </div>
    </React.Fragment>
  );
}

export default App;
