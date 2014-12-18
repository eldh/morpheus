/** @jsx React.DOM */

'use strict';

var React = require('react');
var PostList = require('./PostList');
var Single = require('./Single');
var TagPage = require('./TagPage');
var ErrorPage = require('./Error');
var ApplicationStore = require('../../../shared/stores/ApplicationStore');
var RouterMixin = require('flux-router-component').RouterMixin;
var StoreMixin = require('fluxible-app').StoreMixin;
var canUseDOM = require('react/lib/ExecutionEnvironment').canUseDOM;
var Clicky = require('../../../shared/core-components/Clicky');

var App = React.createClass({
  mixins: [RouterMixin, StoreMixin],
  statics: {
    storeListeners: [ApplicationStore]
  },
  propTypes:{
    context:React.PropTypes.object.isRequired
  },
  getInitialState: function () {
    return this.getStore(ApplicationStore).getState();
  },
  onChange: function () {
    this.setState(this.getStore(ApplicationStore).getState());
  },
  handleDomChanges: function(){
    if (canUseDOM) {
      window.scrollTo(0,0);
      document.title = this.state.pageTitle;
    }
  },
  render: function(){
    this.handleDomChanges();
    if (this.state.error) {
      return (
        <div>
          <ErrorPage context={this.props.context} error={this.state.error}/>;
          <Clicky code={100796735}/>
        </div>
      );
    }
    if (this.state.route.name === 'home' || this.state.route.name === 'page') {
      return (
        <div>
        <PostList context={this.props.context} siteUrl={this.state.siteUrl} page={this.state.route.params.page} pageCount={this.state.pageCount} totalCount={this.state.totalCount}/>;
        <Clicky code={100796735}/>
        </div>
      );
    }
    if (this.state.route.name === 'single') {
      return (
        <div>
        <Single context={this.props.context} slug={this.state.route.params.slug} siteUrl={this.state.siteUrl}/>;
        <Clicky code={100796735}/>
        </div>
      );
    }
    if (this.state.route.name === 'tag') {
      return (
        <div>
        <TagPage context={this.props.context} slug={this.state.route.params.tag} siteUrl={this.state.siteUrl}/>;
        <Clicky code={100796735}/>
        </div>
      );
    }
    return '';
  }
});

module.exports = App;
