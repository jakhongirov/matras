import "./Technologies.scss";
import Header from "../../Components/Header/Header";
import { useContext, useEffect, useState } from "react";
import { SearchContext } from "../../Context/SearchContext";
import { v4 as uuidv4 } from "uuid";
import { storage } from "../../assets/firebase";
// Images
import x from "../../images/Vector.svg";
import image from "../../images/Image.png";
import useFetch from "../../Hooks/useFetch";
import edit from "../../images/edit.svg";
import deleteBtn from "../../images/delete.svg";
import ModalLoading from "../../Components/ModalLoading/ModalLoading";
import DeleteModal from "../../Components/DeleteModal/DeleteModal";

function Technologies() {
  // react state
  const [modal, setModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [img, setImg] = useState("");
  const [url, setUrl] = useState(false);
  const [id, setId] = useState("");
  const [technologies, setTechnologies] = useState([]);
  const [defaultValue, setDefaultValue] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  // context
  const { data, setParam } = useContext(SearchContext);
  // hooks
  const { message, setBody, method, setMethod } = useFetch("/technology");

  useEffect(() => {
    setTechnologies(data);
  }, [data]);

  useEffect(() => {
    setParam("/technology");
  }, [setParam]);

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
    if (inputs.length && url) {
      setBody({
        img: url,
        tech_name: inputs[1].value,
        tech_link: inputs[2].value,
        is_active: inputs[3].checked,
        tech_title: inputs[4].value,
      });
    }
    setModalLoading(true);
  };
  const editBtnClick = (e) => {
    const technology = JSON.parse(e.target.dataset.technologies);
    setUrl(technology.technology_thumbnail);
    setDefaultValue(technology);
    setId(technology.technology_id);
    setMethod("PUT");
    setModal(true);
  };
  const deleteBtnClick = (e) => {
    setMethod("DELETE");
    setBody({
      tech_id: id,
      tech_is_delete: true
    });
    const deletedTechnologies = technologies.filter(
      (item) => item.tech_id !== id
    );
    setTechnologies(deletedTechnologies);
    setModalLoading(true);
    setDeleteModal(false);
  };

  useEffect(() => {
    if (message !== null) {
      setModalLoading(false);
      setModal(false);
      setImg("");
      if (method === "PUT") {
        const { technology } = message;
        const foundTech = technologies.findIndex(
          (t) => t.tech_id === technology.tech_id
        );
        technologies.splice(foundTech, 1, technology);
      }
    }
    if (url) {
      setModalLoading(false);
    }
  }, [message, method, technologies, url]);

  useEffect(() => {
    if (message !== null && method === "POST") {
      const { technology } = message;
      console.log(technology);
      setTechnologies([
        technology,
        ...technologies ,
      ]);
    }
  }, [message, method]);

  const backgroudStyle = {
    backgroundImage:
      method !== "PUT"
        ? img
          ? `url(${img})`
          : `url(${image})`
        : `url(${defaultValue.technology_thumbnail})`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize:
      method !== "PUT" ? (img ? "auto 100%" : "auto") : "auto 100%",
  };
  return (
    <div>
      <Header />
      {technologies.length ? (
        <table>
          <thead>
            <tr>
              <th>Nomlari</th>
              <th>Matn</th>
              <th>Video</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {technologies.map((t) => {
              return (
                <tr key={t.tech_id}>
                  <td>{t.tech_name}</td>
                  <td>
                    {t.tech_title.length <= 15
                      ? t.tech_title
                      : `${t.tech_title.slice(0, 15)}...`}
                  </td>
                  <td>
                    <a
                      href={t.tech_link}
                      target="_blank"
                      rel="noreferrer"
                    >
                      youtube.com
                    </a>
                  </td>
                  <td>
                    <button>
                      <img
                        src={edit}
                        alt="edit"
                        data-technologies={JSON.stringify(t)}
                        onClick={editBtnClick}
                      />
                    </button>
                    <button>
                      <img
                        src={deleteBtn}
                        alt="deleteBtn"
                        onClick={() => {
                          setId(t.tech_id);
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
                  multiple
                />
              </div>
              <div className="loaction_wrapper">
                <label htmlFor="Manzil">Nomi</label>
                <input
                  defaultValue={
                    method === "PUT" ? defaultValue.technology_name : ""
                  }
                  required
                  className="up_input"
                  id="Manzil"
                  type="text"
                />
                <label htmlFor="Video">Video</label>
                <input
                  defaultValue={
                    method === "PUT" ? defaultValue.technology_video : ""
                  }
                  required
                  className="up_input"
                  id="Video"
                  type="text"
                />
                <section>
                  <label className="checkbox-container">
                    Holat
                    <input
                      defaultChecked={
                        method === "PUT" ? defaultValue.technology_is_active : true
                      }
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
                      method === "PUT"
                        ? defaultValue.technology_description
                        : ""
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
        </div>
      ) : (
        ""
      )}
      <ModalLoading modalLoading={modalLoading} />
      <DeleteModal
        deleteModal={deleteModal}
        setDeleteModal={setDeleteModal}
        deleteBtnClick={deleteBtnClick}
      />
    </div>
  );
}

export default Technologies;
