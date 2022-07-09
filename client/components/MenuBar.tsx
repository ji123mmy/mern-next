import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { Menu } from "semantic-ui-react";
import { logout } from "../redux/authSlice";
import { RootState } from "../redux/store";

const { Item } = Menu;

const MenuExamplePointing: React.FC = () => {
  const { pathname } = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  return user ? (
    <Menu pointing secondary size="massive" color="teal">
      <Link href="/home">
        <Item name={user.username} active />
      </Link>
      <Menu.Menu position="right">
        <Item name="logout" onClick={() => dispatch(logout())} />
      </Menu.Menu>
    </Menu>
  ) : (
    <Menu pointing secondary size="massive" color="teal">
      <Link href="/home">
        <Item name="home" active={pathname === "/home"} />
      </Link>
      <Menu.Menu position="right">
        <Link href="/login">
          <Item name="login" active={pathname === "/login"} />
        </Link>

        <Link href="/register">
          <Item name="register" active={pathname === "/register"} />
        </Link>
      </Menu.Menu>
    </Menu>
  );
};

export default MenuExamplePointing;
