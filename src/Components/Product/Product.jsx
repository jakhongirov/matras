import "./Product.scss";
import { useEffect, useState } from "react";
import Shop from "../../assets/shop";
import zoomIn from "../../images/zoom_in.png";

const Product = ({ product, setModal, setModal2, setPr: setProduct }) => {
  const [myProduct, setMyProduct] = useState();
  const [nums, setNums] = useState();

  // function pretty(num) {
  //   const prettyNum = num.split(".")[0].split("").reverse();
  //   const res = [];
  //   prettyNum.forEach((num, index) => {
  //     if ((index + 1) % 3 === 0) {
  //       res.push(num, " ");
  //       return;
  //     }
  //     res.push(num);
  //   });
  //   return res.reverse().join("");
  // }
  // useEffect(() => {
  //   setMyProduct(pretty(product.pro_price));
  //   if (product?.is_on_sale) {
  //     setNums(pretty(product.sale_price));
  //   }
  // }, [product]);

  function clickHandler(e) {
    setModal(e.target.dataset.id);
  }

  function productHandler(e) {
    setProduct(e.target.attributes.getNamedItem("data-id").value);
    setModal(true);
  }

  return (
    <li className="products-list__item">
      <button onClick={clickHandler} data-id={product.pro_id} className="product__zoom-btn product__zoom-btn2">
        <img data-id={product.pro_id} src={zoomIn} alt="" />
      </button>
      <div className="products-list__wr">
        <div className="product__btn-wr">
          {product.pro_new && product.pro_share_price ? (
            <>
              <p className="product__isnew ">Yangi mahsulot</p>
              <p className="product__isnew product__sale product__twopart">
                Aksiya
              </p>
            </>
          ) : product.pro_new ? (
            <p className="product__isnew">Yangi mahsulot</p>
          ) : product.pro_share_price ? (
            <p className="product__isnew product__sale">Aksiya</p>
          ) : (
            <p className="product__helloworld"></p>
          )}

        </div>
        <img src={product.pro_images[0]} className="product__mainim" alt="" />
      </div>
      <div className="products-list__wrapper">
        <h3 className="product__name">{product.pro_name}</h3>
        <ul className="product__detail">
          <li>
            <p className="product__detail-name">Yuklanma</p>
            <p className="product__detail-info">
              <span className="product__detail-number">{product.pro_particle} </span>
              kg
            </p>
          </li>
          <li>
            <p className="product__detail-name">Kafolat</p>
            <p className="product__detail-info">
              <span className="product__detail-number">
                {`${product.pro_guarantee} `}
              </span>
              yil
            </p>
          </li>
          <li>
            <p className="product__detail-name">O’lchami</p>
            <p className="product__detail-info">
              <span className="product__detail-number">
                {product.pro_format}
              </span>
            </p>
          </li>
          <li>
            <p className="product__detail-name">Sig’imi</p>
            <p className="product__detail-info">
              <span className="product__detail-number">
                {`${product.pro_size} `}
              </span>
            </p>
          </li>
        </ul>
        <p className="product__info">{product.pro_info}</p>
        <p className="product__price-name">Narxi</p>
        {product.pro_share_price ? (
          <p className="product__detail-info product__detail-info2">
            <span className="product__outline">
              {`${myProduct} `} <span className="product__sum"> so’m</span>
            </span>
            <span className="product__detail-number"> {`${product.pro_price}`}</span>
            so’m
          </p>
        ) : (
          <p className="product__detail-info">
            <span className="product__detail-number">{product.pro_price}</span>
            so’m
          </p>
        )}
        <button
          className="product__button"
          data-id={product.pro_id}
          onClick={productHandler}
        >
          Buyurtma berish <Shop />
        </button>
      </div>
    </li>
  );
};

export default Product;
