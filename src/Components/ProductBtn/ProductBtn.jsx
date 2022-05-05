import "./ProductBtn.scss";

const ProductBtn = ({ btn, setCategoryId, categoryId }) => {
  const handleClicBtn = () => {
    setCategoryId(btn.model_id);
  };
  return (
    <li
      className={categoryId === btn.model_id ? "list list-active" : "list "}
      onClick={handleClicBtn}
    >
      <span>{btn.model_name}</span>
    </li>
  );
};

export default ProductBtn;
