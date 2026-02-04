import type { ManageProductRowProps } from "../types";
import { Link } from "react-router-dom";

const ManageProductRow: React.FC<ManageProductRowProps> = ({ product, onDelete }) => (
    <li className="list-group-item d-flex justify-content-between align-items-center">
        <strong>{product.name}</strong>

        <Link to={`/admin/product/update/${product._id}`}>
            <span className="badge badge-warning badge-pill">Update</span>
        </Link>

        <span
            onClick={() => onDelete(product._id)}
            className="badge badge-danger badge-pill"
            style={{ cursor: "pointer" }}
        >
            Delete
        </span>
    </li>
);

export default ManageProductRow;