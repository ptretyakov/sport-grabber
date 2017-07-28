import { connect } from 'react-redux';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';

// Constants
import { INDEX_PAGE_TITLE, noImageUrl } from './index.constants';

// Actions
import * as AppActions from 'app/app.actions';
import * as HeaderActions from 'app/shared/header/header.actions';
import * as indexActions from './index.actions';
import { routeToEvents, fetchEventsPage } from 'app/pages/events/events.actions';

// Material-ui components
import IconButton from 'material-ui/IconButton';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import {GridList, GridTile} from 'material-ui/GridList';

const styles = {
  gridTile: {
    // marginTop: 16,
    // marginBottom: 16,
  },
  gridTileTitle: {
    fontSize: '13px',
  },
  gridImage: {
    width: '100%',
  },
};

String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
};

export class IndexContainer extends Component {
  componentWillMount() {
    if(this.props.setHeaderButtons !== undefined) {
      this.props.setHeaderButtons(null, null);
      this.props.headerActions.updateHeaderTitle(INDEX_PAGE_TITLE);
    }
  }

  componentDidMount() {
    this.props.fetchEventsPage();
  }

  render() {
    const favoriteButton = <IconButton
      onTouchTap={::this.handleFavoriteClick}
    >
      <StarBorder color="white" />
    </IconButton>;

    return (
      <div className="row center-md center-sm center-xs">
        <div className="col-md-4 col-sm-5 col-xs-12">
          <GridList cols={1} padding={16}>
            {this.props.events.collection.map((tile) => (
              <GridTile
                key={tile.id}
                title={tile.title.replaceAll('Прогноз на матч', '')}
                titleStyle={styles.gridTileTitle}
                actionIcon={favoriteButton}
                actionPosition="left"
                titlePosition="top"
                
                onTouchTap={(event) => {
                  this.handleTileClick(event, tile.id);
                }}
              >
                <img src={tile.img || noImageUrl} style={styles.gridImage} />
              </GridTile>
            ))}
          </GridList>
        </div>
      </div>
    );
  }

  handleTileClick(event, id) {
    console.log('Hello tile', event);
    this.props.routeActions.routeToEvents(id);
  }

  handleFavoriteClick(event) {
    event.preventDefault();
    event.stopPropagation();

    console.log('Favorite click', event);
  }
}

function mapStateToProps(state) {
  return {
    events: state.events,
    mainAuthor: state.mainAuthor,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    appActions: bindActionCreators(AppActions, dispatch),
    indexActions: bindActionCreators(indexActions, dispatch),
    routeActions: bindActionCreators({routeToEvents}, dispatch),
    headerActions: bindActionCreators(HeaderActions, dispatch),
    fetchEventsPage: bindActionCreators(fetchEventsPage, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(IndexContainer);
