import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { getProducts } from '../../actions';
import AttendantHeader from '../../components/AttendantHeader';
import { searchProduct } from '../../actions';
import { addTransactions } from '../../actions';
import { getLoggedInUser } from '../../actions';
import { currentTransaction } from '../../actions';
import { getCurrentTransactions } from '../../actions';
import { deleteTransaction } from '../../actions';
import { updateStock } from '../../actions';
import ReactToPrint from 'react-to-print';
import AdminHeader from '../../components/AdminHeader';
import axios from 'axios';
import { showAlert } from '../../utils/alert';
import Button from '../../components/Button';
import styles from '../../styles/Transact.module.css';

const Transact = ({
  getProducts,
  searchProduct,
  products,
  updateStock,
  addTransactions,
  getLoggedInUser,
  currentUser,
  currentTransaction,
  getCurrentTransactions,
  currentTransactions,
  deleteTransaction,
}) => {
  const [formError, setFormError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [result, setResult] = useState('');
  const [totalSales, setTotalSales] = useState(0);
  const [formState, setFormState] = useState([]);
  const [displayList, setDisplayList] = useState();
  const quantityRef = useRef();
  const selectedProductNameRef = useRef();

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  useEffect(() => {
    getLoggedInUser();
  }, [getLoggedInUser]);

  useEffect(() => {
    getCurrentTransactions();
  }, [getCurrentTransactions]);

  // useEffect(() => {
  //   currentTransaction(formState);
  // }, [currentTransaction, formState]);

  let productNames;
  let price = 0;
  let componentRef;

  const handleChange = (event) => {
    setSearchTerm(event.target.value);

    if (event.target.value) {
      searchProduct(event.target.value.toLowerCase());
    }
  };

  if (products?.productList) {
    productNames = products.productList.map((prod) => {
      if (result === prod.name) {
        price = prod.price;
      }
      return (
        <p
          key={prod._id}
          onClick={(e) => {
            setSearchTerm(e.target.textContent);

            setResult(e.target.textContent);
          }}
        >
          {prod.name}
        </p>
      );
    });
  }

  if (!searchTerm) {
    productNames = null;
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    const form = event.target;
    if (form.checkValidity() === false) {
      setFormError('All fields are required.');
      return;
    }

    let totalPrice;
    if (quantityRef.current.value) {
      totalPrice = quantityRef.current.value * price;
    }

    setTotalSales(totalSales + totalPrice);

    // setRemoveCount(removeCount + 1);
    if (products && products.productList) {
      products.productList.forEach((prod) => {
        if (prod.name === result && prod.stockcount <= 0)
          showAlert('error', `${result} out of stock`);
      });
    }

    setFormState([
      ...formState,
      {
        name: result,
        quantity: Number(quantityRef.current.value),
        sales: totalPrice,
      },
    ]);
  };

  useEffect(() => {
    setDisplayList(
      formState?.map((list, i) => {
        return (
          <tbody key={i}>
            <tr>
              <td>{list.name}</td>
              <td>{list.quantity}</td>
              <td>{list.sales}</td>
              <td>
                <Button
                  callback={() => {
                    // deleteTransaction(list._id);

                    formState.splice(i, 1);

                    setFormState([...formState]);
                    setTotalSales(totalSales - list.sales);
                  }}
                  icon={<ion-icon name="trash-outline"></ion-icon>}
                />
              </td>
            </tr>
          </tbody>
        );
      })
    );
  }, [formState, currentTransactions, totalSales, deleteTransaction]);

  const divRef = useRef(null);

  useEffect(() => {
    // Attach an event listener to the document that listens for clicks
    document.addEventListener('mousedown', handleClickOutside);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  function handleClickOutside(event) {
    // If the user clicks outside the div, hide it
    if (divRef.current && !divRef.current.contains(event.target)) {
      divRef.current.style.display = 'none';
    }
  }

  return (
    <div>
      {currentUser?.user?.role === 'admin' ? (
        <AdminHeader />
      ) : (
        <AttendantHeader />
      )}
      <div className={styles.attendanttransact}>
        <div className={styles.searchproduct}>
          <input
            type="text"
            placeholder="search item"
            value={searchTerm}
            onChange={handleChange}
            ref={selectedProductNameRef}
          />

          {productNames ? (
            <div className={styles.searchresult} ref={divRef}>
              {productNames}
            </div>
          ) : null}
        </div>
        <form onSubmit={handleSubmit} className={styles.formtransact}>
          <label>
            Price:
            <input
              type="number"
              name="price"
              value={price}
              placeholder="Enter the price"
              required
              readOnly
            />
          </label>
          <label>
            Quantity:
            <input
              type="number"
              name="quantity"
              placeholder="Enter quantity"
              required
              ref={quantityRef}
            />
          </label>
          {formError && <p className="error">{formError}</p>}
          <Button type="submit" text="Add Item" />
        </form>
        <div className={styles.transact}>
          <div ref={(el) => (componentRef = el)} className={styles.saleslist}>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Quantity</th>
                  <th>Sales</th>
                </tr>
              </thead>
              {displayList}
            </table>
            <h2>GH¢{totalSales}</h2>
          </div>

          <ReactToPrint
            trigger={() => {
              return (
                <button className={styles.btnprint}>Confirm Purchase</button>
              );
            }}
            onAfterPrint={async () => {
              console.log(formState);
              addTransactions(formState);

              formState.forEach((product) => {
                updateStock(product.name, product.quantity);
              });
              await axios.delete('/api/delete-all-current-transactions');
            }}
            content={() => componentRef}
            documentTitle="Sales Receipt"
            pageStyle="print"
          />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    products: state.products,
    transactions: state.transactions,
    currentTransactions: state.currentTransactions,
    currentUser: state.user,
  };
};

export default connect(mapStateToProps, {
  getProducts,
  searchProduct,
  updateStock,
  addTransactions,
  getLoggedInUser,
  currentTransaction,
  getCurrentTransactions,
  deleteTransaction,
})(Transact);
