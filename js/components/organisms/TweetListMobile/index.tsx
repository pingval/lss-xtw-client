import React from 'react';
import { connect } from 'react-redux';
import { Theme, createStyles } from '@mui/material/styles';
import * as actions from '../../../actions';
import { RootState } from '../../../reducers';
import TweetList from '../../molecules/TweetList';
import RefreshIcon from '@mui/icons-material/Refresh';
import NavTabs from '../NavTabs';
import Fab from '@mui/material/Fab';
import { makeStyles } from '@mui/styles';

const useStyles = (theme: Theme) =>
  makeStyles({
    root: {
      marginBottom: 40,
      position: 'relative',
    },
    reloadButton: {
      position: 'absolute',
      bottom: theme.spacing(5),
      right: theme.spacing(2),
    },
  })();

type ComponentProps = ReturnType<typeof mapStateToProps>;
type ActionProps = typeof mapDispatchToProps;

type PropsType = ComponentProps & ActionProps;
const TweetListPC: React.SFC<PropsType> = (props: PropsType) => {
  const classes = useStyles(props.theme.theme);

  const tabs = [
    {
      label: '運営ツイート',
    },
  ];

  return (
    <div className={classes.root}>
      <NavTabs tabs={tabs} style={{ top: 73 }}>
        <div style={{ height: '100%' }}>
          <TweetList tweets={props.list.user} deleteTweet={props.deleteTweet} replyTweet={props.replyTweet} retweet={props.retweet} />
        </div>
        <div style={{ height: '100%' }}>
          <TweetList tweets={props.list.mention} />
        </div>
        <div style={{ height: '100%' }}>
          <TweetList tweets={props.list.hash} />
        </div>
      </NavTabs>
      <Fab className={classes.reloadButton} style={{ position: 'absolute' }} color={'primary'} onClick={() => props.reloadTweet()}>
        <RefreshIcon />
      </Fab>
    </div>
  );
};

// state
const mapStateToProps = (state: RootState) => {
  return {
    list: state.reducer.twitterTimeline,
    theme: state.reducer.theme,
  };
};

// action
const mapDispatchToProps = {
  deleteTweet: actions.deleteTweet,
  retweet: actions.addAttachUrl,
  replyTweet: actions.addReplyTweet,
  reloadTweet: actions.reloadTweetList,
};

export default connect(mapStateToProps, mapDispatchToProps)(TweetListPC);
