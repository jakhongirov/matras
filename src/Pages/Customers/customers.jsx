import "./customers.scss";

// React Components
import { useContext, useEffect, useState } from "react";
import { SearchContext } from "../../Context/SearchContext";

// Components
import Header from "../../Components/Header/Header";

// Images
import deleteBtn from "../../images/delete.svg";
import useFetch from "../../Hooks/useFetch";
import ModalLoading from "../../Components/ModalLoading/ModalLoading";
import DeleteModal from "../../Components/DeleteModal/DeleteModal";

function Customers() {
  const [modalLoading, setModalLoading] = useState(false);
  const [customers, setCustomers] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [id, setId] = useState("");
  const { data, setParam, setName } = useContext(SearchContext);
  const { message, setBody, method, setMethod } = useFetch("/customers");

  useEffect(() => {
    setCustomers(data);
  }, [data]);

  useEffect(() => {
    setName("quote_number");
    setParam("/customers");
  }, [setName, setParam]);

  const checkboxChange = (e) => {
    setMethod("PUT");
    setBody({
      cust_id: e.target.dataset.id,
      cust_feedback: e.target.checked,
    });
    setModalLoading(true);
  };

  const deleteBtnClick = (e) => {
    setMethod("DELETE");
    setBody({
      cust_id: id,
      cust_is_delete: true
    });
    const deletedCustomer = customers.filter((item) => item.cust_id !== id);
    setCustomers(deletedCustomer);
    setDeleteModal(false);
    setModalLoading(true);
  };
  useEffect(() => {
    if (message !== null) {
      setModalLoading(false);
      if (method === "PUT") {
        window.location.reload();
      }
    }
  }, [message, method]);

  return (
    <div>
      <Header placeholder="User" input={true} />

      {customers && customers.length  ? (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>sana</th>
              <th>telefon raqami</th>
              <th>Qayta aloqa</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c, i) => {
              const date = c.curt_create_at ? c.curt_create_at.split(/[.T\s/]/) : "";
              return (
                <tr key={i} className="table_tr">
                  <td>{i + 1}</td>
                  <td>
                    {date[1]}-<span className="date">{date[0]}</span>
                  </td>
                  <td>{c.cust_phone}</td>
                  <td>
                    <div className="customers_checkbox_wrapper">
                      <label className="checkbox-container customers_checkbox-container">
                        <input
                          defaultChecked={c.cust_feedback}
                          required
                          className="customer_input"
                          type="checkbox"
                          data-id={c.cust_id}
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
                        data-id={c.cust_id}
                        onClick={() => {
                          setId(c.cust_id);
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
      <ModalLoading modalLoading={modalLoading} />
      <DeleteModal
        deleteModal={deleteModal}
        setDeleteModal={setDeleteModal}
        deleteBtnClick={deleteBtnClick}
      />
    </div>
  );
}

export default Customers;
