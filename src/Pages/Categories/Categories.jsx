import { useContext, useEffect, useState } from "react";
import Header from "../../Components/Header/Header";
import { SearchContext } from "../../Context/SearchContext";

// images
import deleteBtn from "../../images/delete.svg";
import x from "../../images/Vector.svg";
import "./Categories.scss";
import useFetch from "../../Hooks/useFetch";
import ModalLoading from "../../Components/ModalLoading/ModalLoading";
import DeleteModal from "../../Components/DeleteModal/DeleteModal";

function Categories() {
  const [modal, setModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [id, setId] = useState("");
  // contexts
  const { data, setParam } = useContext(SearchContext);
  // hooks
  const { message, setBody, method, setMethod } = useFetch("/model");

  useEffect(() => {
    setCategories(data);
  }, [data]);

  useEffect(() => {
    setParam("/model");
  }, [setParam]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const inputs = document.querySelectorAll(".up_input");
    setBody({
      model_name: inputs[0].value,
      model_active: inputs[1].checked,
    });
    setModalLoading(true);
  };

  useEffect(() => {
    if (message !== null && method === "POST") {
      const { category } = message;
      setCategories((prevData) => [category, ...prevData]);
    }
  }, [message, method]);

  const checkboxChange = (e) => {
    setMethod("PUT");
    setBody({
      model_id: e.target.dataset.id,
      model_active: e.target.checked,
    });
    setModalLoading(true);
  };

  const deleteBtnClick = (e) => {
    setMethod("DELETE");
    setBody({
      model_id: id,
      model_is_delete: true
    });
    const deletedCategories = categories.filter(
      (item) => item.model_id !== id
    );
    setCategories(deletedCategories);

    setDeleteModal(false);
    setModalLoading(true);
  };

  useEffect(() => {
    if (message !== null) {
      setModalLoading(false);
      setModal(false);
      if (method === "PUT") {
        const { category } = message;
        console.log(category);
        const foundCategory = categories.findIndex(
          (c) => c.model_id === category.model_id
        );
        categories.splice(foundCategory, 1, category);
      }
    }
  }, [categories, message, method]);

  return (
    <div>
      <Header />
      {categories && categories.length ? (
        <table>
          <thead>
            <tr>
              <th>Toifalar</th>
              <th>Holat</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c, i) => {
              return (
                <tr key={i}>
                  <td>{c.model_name}</td>
                  <td>
                    <div className="customers_checkbox_wrapper">
                      <label className="checkbox-container customers_checkbox-container">
                        <input
                          defaultChecked={c.model_active}
                          className="customer_input"
                          type="checkbox"
                          data-id={c.model_id}
                          onChange={checkboxChange}
                        />
                        <span className="checkmark customers_checkmark">
                          <div></div>
                        </span>
                      </label>
                    </div>
                  </td>
                  <td>
                    <button>
                      <img
                        src={deleteBtn}
                        alt="deleteBtn"
                        data-id={c.model_id}
                        onClick={() => {
                          setId(c.model_id);
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
          <div className="modal category_modal">
            <h3>Qo’shish</h3>
            <form className="form" onSubmit={handleSubmit}>
              <div className="loaction_wrapper category_wrapper">
                <label htmlFor="Manzil">Kategoriya nomi</label>
                <input
                  required
                  className="up_input"
                  id="Manzil"
                  type="text"
                  placeholder="masalan: Model B"
                />
                <section>
                  <label className="checkbox-container">
                    Holat
                    <input
                      defaultChecked={true}
                      className="up_input"
                      type="checkbox"
                    />
                    <span className="checkmark">
                      <div></div>
                    </span>
                  </label>
                </section>
                <button className="addBtn category_addBtn" type="submit">
                  Qo’shish
                </button>
              </div>
            </form>
            <button className="btn_x" onClick={() => setModal(false)}>
              <img src={x} alt="x" />
            </button>
          </div>
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

export default Categories;
