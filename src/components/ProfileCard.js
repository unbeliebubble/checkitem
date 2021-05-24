import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { Form, Input, Button ,Row, Col, Spin} from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import { logoutFromFirebase, updateUserInfo,creatOrderByUid} from "../actions";
import { StoreContext } from "../store";

const ProfileCard = () => {
  const {state: {userSignin: { userInfo },  searchOrderDetailByUid: {
loading,
    order,
    error,
    tapOrNot
  },},dispatch,} = useContext(StoreContext);
 
  const { displayName, email } = userInfo;
  const history = useHistory();
  const [form] = Form.useForm();
  const antIcon = <LoadingOutlined style={{ fontSize: 80, color: "#8183ff" }} spin />;
  const handleUpdate = (values) => {
    console.log(values)
    updateUserInfo(dispatch, values);
  };

  const handleLogout = () => {
    logoutFromFirebase(dispatch);
    history.push("/");
  };

  const handleOrderSearch = () => {
    console.log(order);
   creatOrderByUid(dispatch);
  };
  

  return (
    <div className="profile_cont">
    <Form
      onFinish={handleUpdate}
      name="normal_login"
      className="login-form"
      form={form}
      initialValues={userInfo}
    >
      <Form.Item
        label="name: "
        name="name"
        rules={[
          {
            type: "string",
            message: "The input is not valid name!",
          },
          {
            message: "Please input your name!",
          },
        ]}
        hasFeedback
      >
        <Input placeholder={displayName} />
      </Form.Item>
      <Form.Item
        label="email: "
        name="email"
        rules={[
          {
            type: "email",
            message: "The input is not valid E-mail!",
          },
          {
            message: "Please input your E-mail!",
          },
        ]}
        hasFeedback
      >
        <Input placeholder={email} />
      </Form.Item>
      <Form.Item
        name="password"
        label="Password"
        rules={[
          {
            message: "Please input your password!",
          },
        ]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="rePassword"
        label="Re-enter Password"
        dependencies={["password"]}
        hasFeedback
        rules={[
          {
            message: "Please re-enter your password!",
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }

              return Promise.reject(
                new Error("The two passwords that you entered do not match!")
              );
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          className="login-form__button"
        >
          Submit
        </Button>

        <Button
          type="danger"
          style={{ marginTop: "0.8rem" }}
          className="login-form__button"
          onClick={handleLogout}
        >
          Log out
        </Button>
      </Form.Item>
    </Form>
    <Button
         
          style={{ marginTop: "3rem" }}
          className="orderSearch_btn"
          onClick={handleOrderSearch}
        
        >
          訂單查詢
        </Button>
   <div class="profileOrder">
   { tapOrNot?(loading
            ? (
               <div className="spinner-wrap">
                  <Spin indicator={antIcon} className="spinner" />
               </div>
            ) : (
              order.length===0?(<div className='eachOrder_title'><p>None</p></div>):(
              order.map((eachOrder,index)=>{return(
<Row gutter={[24, 24]}>
<Col         
 xs={{ span: 20, offset: 2 }}
 
 >

  <div className="eachOrder_title"><p>Order {index+1}</p></div>
  </Col>
<Col         
 xs={{ span: 20, offset: 2 }}
 lg={{ span: 13, offset: 2 }}
 >

<div className="card card-body">
                        <h2 style={{ color: 'white' }}>Shipping</h2>
                        <p>
                           <strong>Name:</strong> {eachOrder.shippingAddress.fullName} <br />
                           <strong>Address: </strong> {eachOrder.shippingAddress.address},
                  {eachOrder.shippingAddress.city}, {eachOrder.shippingAddress.postalCode}
                  ,{eachOrder.shippingAddress.country}
                        </p>
                     </div>
                     <div className="card card-body">
                        <h2 style={{ color: 'white' }}>Payment</h2>
                        <p>
                           <strong>Method:</strong> {eachOrder.paymentMethod}
                        </p>
                     </div>
                     
                     <div className="card card-body">
                        <h2 style={{ color: 'white' }}>Order Items</h2>
                        {
                           eachOrder.orderItems.map(item => (
                              <li key={item.id} className="cart-item">
                                 <div className="cart-image">
                                    <img src={item.image} alt={item.name} />
                                 </div>
                                 <div className="cart-item-content">
                                    <div className="cart-name">{item.name}</div>
                                    <div className="product-qty">
                                       Qty: {item.qty}
                                    </div>
                                 </div>
                                 <div className="cart-item-end">
                                    <div className="cart-price">
                                       ${item.price * item.qty}
                                    </div>
                                 </div>

                              </li>
                           ))
                           }
                        <div className="cart-total-price-wrap">
                           Total
            <div className="cart-total-price">${eachOrder.totalPrice}</div>
                        </div>
                     </div>

 </Col>
   <Col
   xs={{ span: 20, offset: 2 }}
   lg={{ span: 7, offset: 0 }}
>
   <div className="card card-body">
      <h2 style={{ color: 'white' }}>Order Summary</h2>
      <div className="row">
         <div>Items</div>
         <div>${eachOrder.itemsPrice}</div>
      </div>
      <div className="row">
         <div>Shipping</div>
         <div>${eachOrder.shippingPrice}</div>
      </div>
      <div className="row">
         <div>Tax</div>
         <div>${eachOrder.taxPrice}</div>
      </div>
      <div className="row">
         <div>
            <strong> Order Total</strong>
         </div>
         <div>
            <strong>${eachOrder.totalPrice}</strong>
         </div>
      </div>
    
   </div>

</Col>     
</Row>         
              )
            })
              )
          

            )
   ):(<div></div>)
         }
   </div>
  
    </div>
  );
};
export default ProfileCard;
