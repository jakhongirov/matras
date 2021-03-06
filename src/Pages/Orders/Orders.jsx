import { useContext, useEffect, useState } from "react";
import Header from "../../Components/Header/Header";
import { SearchContext } from "../../Context/SearchContext";
import useFetch from "../../Hooks/useFetch";
import loading from "../../images/loading.png";
import "./Orders.scss";

function Orders() {
  const [modalLoading, setModalLoading] = useState(false);
  const { data, setParam, setName } = useContext(SearchContext);

  useEffect(() => {
    setName("order_customer_name");
    setParam("/orders");
  }, [setName, setParam]);

  // hooks
  const { message, setBody, setMethod } = useFetch("/orders");

  const checkboxChange = (e) => {
    setMethod("PUT");
    setBody({
      order_id: e.target.dataset.id,
      order_feedback: e.target.checked,
    });
    setModalLoading(true);
  };

  useEffect(() => {
    if (message !== null) {
      setModalLoading(false);
      window.location.reload();
    }
  }, [message]);

  return (
    <div>
      <Header placeholder={"User"} input={true} />
      {data  ? (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Ismi</th>
              <th>Telefon Raqami</th>
              <th>Mahsulot Nomlari</th>
              <th>Miqdor</th>
              <th>Qayta aloqa</th>
            </tr>
          </thead>
          <tbody>
            {data.map((o, i) => {
              return (
                <tr key={o.order_id}>
                  <td>{i + 1}</td>
                  <td>{o.user_name}</td>
                  <td>{o.user_phone}</td>
                  <td>{o.order_pro_name}</td>
                  <td>{o.order_count}</td>
                  <td>
                    <div className="customers_checkbox_wrapper">
                      <label className="checkbox-container customers_checkbox-container">
                        <input
                          defaultChecked={o.order_feedback}
                          className="customer_input"
                          type="checkbox"
                          data-id={o.order_id}
                          onChange={checkboxChange}
                        />
                        <span className="checkmark customers_checkmark">
                          <div></div>
                        </span>
                      </label>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        ""
      )}
      {/* loading modal */}
      {modalLoading ? (
        <div className="loading_modal_wrapper">
          <img src={loading} alt="loading" />
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default Orders;
