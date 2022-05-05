import "./addresses.scss";

// Main Components
import { useContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
// Images
import Header from "../../Components/Header/Header";
import place from "../../images/place.svg";
import edit from "../../images/edit.svg";
import deleteBtn from "../../images/delete.svg";
import x from "../../images/Vector.svg";
import image from "../../images/Image.png";

// Contexts
import { SearchContext } from "../../Context/SearchContext";
import { storage } from "../../assets/firebase";

// Hooks
import useFetch from "../../Hooks/useFetch";
import ModalLoading from "../../Components/ModalLoading/ModalLoading";
import DeleteModal from "../../Components/DeleteModal/DeleteModal";

function Addresses() {
  // react state
  const [modal, setModal] = useState(false);
  const [img, setImg] = useState("");
  const [modalLoading, setModalLoading] = useState(false);
  const [url, setUrl] = useState(false);
  const [id, setId] = useState("");
  const [address, setAddress] = useState([]);
  const [defaultValue, setDefaultValue] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);

  // context
  const { data, setParam } = useContext(SearchContext);

  // hooks
  const { message, setBody, method, setMethod } = useFetch("/address");

  useEffect(() => {
    setAddress(data);
  }, [data]);

  useEffect(() => {
    setParam("/address");
  }, [setParam]);

  // Upload to Firebase
  const inputChange = (e) => {
    const image = e.target.files[0];
    const name = uuidv4();
    const upload = storage.ref(`images/${name}`).put(image);
    upload.on(
      "state_changed",
      (snapshot) => { },
      (error) => {
        console.log(error);
      },
      () => {
        storage
          .ref("images")
          .child(name)
          .getDownloadURL()
          .then((url) => {
            setUrl(url);
          });
      }
    );
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = () => {
      setImg(reader.result);
    };
    setModalLoading(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const inputs = document.querySelectorAll(".up_input");
    const locationName = inputs[2].value.includes(",")
      ? inputs[2].value.split(",")
      : false;

    console.log(inputs[1].value,);
    if (inputs.length && url && locationName) {
      setBody({
        add_name: inputs[1].value,
        add_image: url,
        add_loc: +locationName[0],
        add_is_delete: inputs[3].checked,
        add_intended: inputs[4].value,
      });
    }
    setModalLoading(true);
  };

  useEffect(() => {
    if (message !== null) {
      setModalLoading(false);
      setModal(false);
      setImg("");
      if (method === "PUT") {
        const foundAddress = address.findIndex(
          (a) => a.add_id === message.add_id
        );
        address.splice(foundAddress, 1, message);
      }
    }
    if (url) {
      setModalLoading(false);
    }
  }, [address, message, method, url]);

  useEffect(() => {
    if (message !== null && method === "POST") {
      setAddress([message, ...address]);
    }
  }, [message, method]);

  const deleteBtnClick = () => {
    setMethod("DELETE");
    setBody({
      add_id: id,
      add_is_delete: true
    });
    const deletedAddress = address.filter((item) => item.add_id !== id);
    setAddress(deletedAddress);
    setModalLoading(true);
    setDeleteModal(false);
  };

  const editBtnClick = (e) => {
    const addressValue = JSON.parse(e.target.dataset.address);
    setUrl(addressValue.address_image);
    setDefaultValue(addressValue);
    setId(addressValue.address_id);
    setMethod("PUT");
    setModal(true);
  };

  const backgroudStyle = {
    backgroundImage:
      method !== "PUT"
        ? img
          ? `url(${img})`
          : `url(${image})`
        : `url(${defaultValue.address_image})`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize:
      method !== "PUT" ? (img ? "auto 100%" : "auto") : "auto 100%",
  };

  return (
    <div>
      <Header input={false} />
      {address && address.length ? (
        <table>
          <thead>
            <tr>
              <th>Manzil</th>
              <th>Matn</th>
              <th>Location</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {address.map((a, i) => {
              return (
                <tr key={i}>
                  <td>{a.add_name}</td>
                  <td>
                    {a.add_intended.length <= 15
                      ? a.add_intended
                      : `${a.add_intended.slice(0, 15)}...`}
                  </td>
                  <td>
                    <a
                      href={`https://maps.google.com/?q=${a.add_loc}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img src={place} alt="place" />
                    </a>
                  </td>
                  <td>
                    <button>
                      <img
                        data-address={JSON.stringify(a)}
                        src={edit}
                        alt="edit"
                        onClick={editBtnClick}
                      />
                    </button>
                    <button>
                      <img
                        src={deleteBtn}
                        alt="deleteBtn"
                        onClick={() => {
                          setId(a.add_id);
                          setDeleteModal(true);
                        }}
                      />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        ""
      )}

      {/* Add Button */}
      <button
        className="add_btn"
        onClick={() => {
          setModal(true);
          setMethod("POST");
        }}
      >
        Qo’shish
      </button>
      {modal ? (
        <div
          className="modal_wrapper"
          onClick={(e) =>
            e.target.classList[0] === "modal_wrapper" ? setModal(false) : ""
          }
        >
          <div className="modal">
            <h3>Tahrirlash</h3>
            <form className="form" onSubmit={handleSubmit}>
              <div className="file-input_wrapper" style={backgroudStyle}>
                <label htmlFor="input-file"></label>
                <input
                  required={method === "PUT" ? false : true}
                  className="up_input"
                  id="input-file"
                  type="file"
                  onChange={inputChange}
                />
              </div>
              <div className="loaction_wrapper">
                <label htmlFor="Manzil">Manzil nomi</label>
                <input
                  defaultValue={
                    method === "PUT" ? defaultValue.address_name : ""
                  }
                  required
                  className="up_input"
                  id="Manzil"
                  type="text"
                />
                <label htmlFor="Location">Location</label>
                <input
                  defaultValue={
                    method === "PUT"
                      ? `${defaultValue.address_long},${defaultValue.address_lat}`
                      : ""
                  }
                  required
                  className="up_input"
                  id="Location"
                  type="text"
                />
                <section>
                  <label className="checkbox-container">
                    Holat
                    <input
                      defaultChecked={
                        method === "PUT"
                          ? defaultValue.address_is_active
                          : false
                      }
                      required
                      className="up_input"
                      type="checkbox"
                    />
                    <span className="checkmark">
                      <div></div>
                    </span>
                  </label>
                </section>
              </div>
              <div className="textarea_wrapper">
                <label htmlFor="Matn">
                  <p>Matn</p>
                  <textarea
                    defaultValue={
                      method === "PUT" ? defaultValue.add_intended : ""
                    }
                    required
                    className="up_input"
                    id="Matn"
                    cols="30"
                    rows="10"
                  ></textarea>
                </label>
                <button className="addBtn" type="submit">
                  Saqlash
                </button>
              </div>
            </form>
            <button className="btn_x" onClick={() => setModal(false)}>
              <img src={x} alt="x" />
            </button>
          </div>

          {/* loading modal */}
          <ModalLoading modalLoading={modalLoading} />
        </div>
      ) : (
        ""
      )}
      <DeleteModal
        deleteModal={deleteModal}
        setDeleteModal={setDeleteModal}
        deleteBtnClick={deleteBtnClick}
      />
    </div>
  );
}

export default Addresses;
