import "./Styles/Dash.css";
import icon from "../Images/Svg/cart.svg";
import { Link } from "react-router-dom";
import StatCard from "../Components/StatCard";
const Sales = () => {
  return (
    <>
      <div className="margin-p"></div>
      <div className="dash-container">
        <div className="sidebar">
          <Link to="/Admin/Dashboard">
            <section>
              <div className="min-sex">
                <img src={icon} alt="" />
                <hr />
              </div>
              <div className="center">
                <h4>Dashboard</h4>
              </div>
            </section>
          </Link>
          <Link to="/Admin/Sales">
            <section>
              <div className="min-sex">
                <img src={icon} alt="" />
                <hr />
              </div>
              <div className="center">
                <h4>Ventas</h4>
              </div>
            </section>
          </Link>
          <Link to="/Admin/Employees">
            <section>
              <div className="min-sex">
                <img src={icon} alt="" />
                <hr />
              </div>
              <div className="center">
                <h4>Empleados</h4>
              </div>
            </section>
          </Link>
          <Link to="/Admin/Orders">
            <section>
              <div className="min-sex">
                <img src={icon} alt="" />
                <hr />
              </div>
              <div className="center">
                <h4>Orders</h4>
              </div>
            </section>
          </Link>
        </div>
        <div className="dash-main">
          
          <div className="table-container">
          <h1>Ventas</h1>
            <div className="table">
              <table>
                <thead>
                  <tr>
                    <th>Empleado</th>
                    <th>Libro</th>
                    <th>Fecha</th>
                    <th>Cantidad</th>
                    <th>Precio Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Juan Pérez</td>
                    <td>Harry Potter y la Piedra Filosofal</td>
                    <td>2024-11-20</td>
                    <td>3</td>
                    <td>$45.00</td>
                  </tr>
                  <tr>
                    <td>María López</td>
                    <td>El Señor de los Anillos</td>
                    <td>2024-11-22</td>
                    <td>2</td>
                    <td>$30.00</td>
                  </tr>
                  <tr>
                    <td>Carlos García</td>
                    <td>El Hobbit</td>
                    <td>2024-11-23</td>
                    <td>1</td>
                    <td>$15.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="stats-container">
            <StatCard atributo={"Ventas anuales"} valor={"321"} />
            <StatCard atributo={"Ganancias Totales:"} valor={"$5.000.230"} />
          </div>
        </div>
      </div>
    </>
  );
};
export default Sales;
