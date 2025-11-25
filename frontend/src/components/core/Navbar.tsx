import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
import { useNavigate, NavLink } from 'react-router-dom'

const Navbar = () => {
    const navigate = useNavigate();
    return (
        <nav>
            <ul>


                {/* {isAuthenticated() && ( */}
                <li className="nav-item">
                    <span
                        className="nav-link"
                        style={{ cursor: "pointer", color: "#3a3535" }}
                    // onClick={() =>
                    // signout(() => {
                    //       navigate("/")
                    //     })
                    //   }
                    >
                        Signout
                    </span>
                </li>
                {/* )} */}

                <li><Person2OutlinedIcon /></li>

                {/* if authenticated, show icon, else show signin/signup */}
                <li><NavLink to="/cart"
                    style={({ isActive }) => ({
                        color: isActive ? '#000000' : '#ffffff'
                    })}>
                    <ShoppingCartOutlinedIcon />
                    <sup>
                        <small className="cart-badge"></small>
                    </sup>
                </NavLink></li>
            </ul>
        </nav>
    )
}

export default Navbar