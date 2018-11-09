import React from "react";
import i18next from "i18next";
import { connect } from "react-redux";

import { LoaderButton, Button } from "theme";
import { prettyFormatMinutes } from "services/formatting";
import { endMeeting, extendMeeting, runMeetingAction } from "apps/device/store/meeting-actions";
import {
  currentActionSourceSelector,
  currentMeetingSelector,
  minutesAvailableTillNextMeetingSelector
} from "apps/device/store/selectors";

import ButtonSet from "./components/ButtonSet";
import ConfirmBar from "./components/ConfirmBar";

class MeetingCheckedIn extends React.PureComponent {
  state = { idOfMeetingToEnd: null };

  render() {
    const { currentMeetingId, minutesToNextMeeting, currentActionSource, extendMeeting } = this.props;
    const { idOfMeetingToEnd } = this.state;

    if (idOfMeetingToEnd === currentMeetingId) {
      return this.renderEndMeetingConfirmationBar();
    }

    const ExtendButton = ({ value, name }) => (
      <LoaderButton
        white
        disabled={currentActionSource !== null}
        isLoading={currentActionSource === name}
        onClick={() => extendMeeting(value, name)}
        children={"+" + prettyFormatMinutes(value)}
      />
    );

    const showCustomExtensionTime = minutesToNextMeeting > 0 && minutesToNextMeeting <= 70;

    return (
      <React.Fragment>
        {minutesToNextMeeting > 0 && (
          <ButtonSet>
            <Button success disabled>{i18next.t("actions.extend")}</Button>
            {minutesToNextMeeting > 20 && <ExtendButton value={15} name="extend-15"/>}
            {minutesToNextMeeting > 40 && <ExtendButton value={30} name="extend-30"/>}
            {minutesToNextMeeting > 70 && <ExtendButton value={60} name="extend-60"/>}
            {showCustomExtensionTime && <ExtendButton value={minutesToNextMeeting} name="extend-custom"/>}
          </ButtonSet>
        )}
      </React.Fragment>
    );
  }

  renderEndMeetingConfirmationBar() {
    const { currentActionSource, endMeeting } = this.props;

    return <ConfirmBar
      inProgress={currentActionSource === "end-meeting"}
      onSubmit={() => endMeeting("end-meeting")}
      onCancel={() => this.setState({ idOfMeetingToEnd: null })}
    />;
  }
}

const mapStateToProps = state => ({
  currentMeetingId: currentMeetingSelector(state).id,
  currentActionSource: currentActionSourceSelector(state),
  minutesToNextMeeting: minutesAvailableTillNextMeetingSelector(state)
});

const mapDispatchToProps = dispatch => ({
  extendMeeting: (minutes, source) => dispatch(runMeetingAction(extendMeeting(minutes), source)),
  endMeeting: (source) => dispatch(runMeetingAction(endMeeting(), source))
});

export default connect(mapStateToProps, mapDispatchToProps)(MeetingCheckedIn);