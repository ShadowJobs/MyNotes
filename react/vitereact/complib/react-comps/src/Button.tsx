const Button: React.FC<{ onClick?: () => void, children?: any }> = ({ onClick, children }) => (
  <button onClick={onClick} style={{
    border: "1px solid #ccc",
    borderRadius: 6,
    padding: 3,
  }}>{children}</button>
);

export default Button;