import React from 'react';
import { makeStyles } from '@mui/styles';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import { RootState } from '../../../reducers';
import * as actions from '../../../actions';
import { connect } from 'react-redux';

const useStyles = makeStyles({
  root: {},
});

type ComponentProps = ReturnType<typeof mapStateToProps>;
type ActionProps = typeof mapDispatchToProps;

type PropsType = ComponentProps & ActionProps;

export const Header: React.SFC<PropsType> = (props) => {
  const classes = useStyles();
  return (
      <List>
        {props.linkList.map((link, index) => {
          return (
            <div key={index}>
              <ListItem button onClick={() => window.open(link.url)}>
                <ListItemText>{link.name}</ListItemText>
              </ListItem>
              <Divider />
            </div>
          );
        })}
      </List>
  );
};

// state
const mapStateToProps = (state: RootState) => {
  return {
    linkList: state.reducer.config.headerLink,
  };
};

export default connect(mapStateToProps)(Header);
