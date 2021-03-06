import React from "react";
import {
    viewProfile,
    updateProfile,
    deleteUser,
    findContentsForUser,
    followUser,
    unfollowUser, getFollowers, getFollowings
} from "../services/UserService";
import "./ProfileComponent.css"
import {Link} from "react-router-dom";

class ProfileViewOnlyComponent extends React.Component {
    state = {
        viewProfile: {
            userId: 0,
            username: '',
            firstName: '',
            lastName: '',
            email: '',
            userType: "PUBLIC"
        },
        followers: [],
        following: [],
        contents: [],
        isFollower: false,
    }

    componentDidMount() {
        viewProfile(this.props.viewUserId)
            .then(profile => {
                if (profile !== undefined){this.setState({viewProfile: profile})};
              findContentsForUser(this.state.viewProfile.userId)
                  .then(response => {this.setState({contents: this.sortByRecent(response)})});
              getFollowers(this.state.viewProfile.userId)
                  .then(response => {
                      this.setState({followers: response});
                      for (const foll in response){
                          if (response[foll].userId === this.props.profile.userId){
                              this.setState({isFollower: true})
                          }
                      }
                  });
              getFollowings(this.state.viewProfile.userId)
                  .then(response => {this.setState({following: response})});
            }
            )
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.viewUserId !== this.props.viewUserId) {
            viewProfile(this.props.viewUserId)
                .then(profile => {
                          if (profile !== undefined){this.setState({viewProfile: profile})};
                          findContentsForUser(this.state.viewProfile.userId)
                              .then(response => {this.setState({contents: this.sortByRecent(response)})});
                          getFollowers(this.state.viewProfile.userId)
                              .then(response => {
                                  this.setState({followers: response});
                                  for (const foll in response){
                                      if (response[foll].userId === this.props.profile.userId){
                                          this.setState({isFollower: true})
                                      }
                                  }
                              });
                          getFollowings(this.state.viewProfile.userId)
                              .then(response => {this.setState({following: response})});
                      }
                )
        }
    }

    sortByRecent = (activities) => {
        for (const act in activities) {
            activities[act].creationDate = new Date(activities[act].creationDate);
        }
        const sorted = activities.sort((a,b) => b.creationDate - a.creationDate);
        return sorted;
    }

    deleteUser(userId) {
        deleteUser(userId)
            .then(response => {
            this.setState({viewProfile: {...this.state.viewProfile, userType: "PUBLIC"}})
        })
    }

    makeAdmin(){
        updateProfile({userId: this.state.viewProfile.userId, userType: "ADMIN"});
        this.setState({viewProfile: {...this.state.viewProfile, userType:"ADMIN"}});
    }

    follow(){
        this.setState({isFollower: true});
        followUser(this.props.profile.userId, this.state.viewProfile.userId);
        this.setState({followers: [...this.state.followers, this.props.profile]})
    }

    unfollow(){
        this.setState({isFollower: false});
        unfollowUser(this.props.profile.userId, this.state.viewProfile.userId)
        this.setState({followers: this.state.followers.filter(follower => follower.userId !== this.props.profile.userId)})
    }

    render() {
        return(
            <div>
                {this.state.viewProfile.userType === "PUBLIC" &&
                 <div  className="wbdv-profile-background wbdv-profile-public">
                     <div className="wbdv-login-notice">
                         <h1>This user does not exist!</h1>
                     </div>
                 </div>}

                {this.state.viewProfile.userType !== "PUBLIC" &&
                 <div className="wbdv-profile-background">
                     { this.props.profile.userType === "ADMIN" &&
                     <div className="wbdv-logout">
                         {this.state.viewProfile.userType !== "ADMIN" &&
                          <button onClick={() => this.makeAdmin()}
                                  className="btn btn-warning wbdv-logout-btn wbdv-left">
                              <i className="fa fa-thumbs-up"/>
                              &nbsp;Upgrade this user to ADMIN!
                          </button>
                         }
                         <button onClick={() => this.deleteUser(this.state.viewProfile.userId)}
                             className="btn btn-danger wbdv-logout-btn">
                             <i className="fa fa-trash"/>
                             &nbsp;Delete this user.
                         </button>
                     </div> }
                     { this.state.viewProfile.userType !== "ADMIN" && <br/>}
                     <div className="row">
                         <div className="col-md-4">
                             <div className="wbdv-profile-section">
                                 <h2 className="wbdv-section-title">
                                     About
                                 </h2>
                                 <div className="wbdv-section-details">
                                     <p>Username:
                                         <span className="wbdv-bold"> {this.state.viewProfile.username}</span>
                                     </p>
                                     <p>Type:
                                         <span className="wbdv-bold"> {this.state.viewProfile.userType}</span>
                                     </p>
                                     <p>Name:&nbsp;&nbsp;
                                         <span className="wbdv-bold">
                                             {this.state.viewProfile.firstName} {this.state.viewProfile.lastName}
                                         </span>
                                     </p>
                                     <p>Email:&nbsp;&nbsp;
                                         <span className="wbdv-bold">
                                                 {this.state.viewProfile.email}
                                         </span>
                                     </p>
                                 </div>
                             </div>
                             <div className="wbdv-profile-section">
                                 <h2 className="wbdv-section-title">Following</h2>
                                 <div className="wbdv-section-details">
                                     <ul>
                                         {this.state.following && this.state.following < 1 &&
                                          <li> This field lay barren. </li>}
                                         {this.state.following && this.state.following.map(follow =>
                                           <li key={follow.userId}>
                                               <Link to={`/profile/${follow.userId}`}>
                                                   {follow.username}
                                               </Link>
                                           </li>
                                         )}
                                     </ul>
                                 </div>
                             </div>
                             <div className="wbdv-profile-section">
                                 <h2 className="wbdv-section-title">
                                     Followers
                                     {this.props.profile.userType !== "PUBLIC" && !this.state.isFollower &&
                                      <button id="wbdv-profile-edit" className="btn btn-warning"
                                              title="Edit My Details"
                                              onClick={() => this.follow()}>
                                          Follow
                                      </button>}
                                     {this.props.profile.userType !== "PUBLIC" && this.state.isFollower &&
                                      <button id="wbdv-profile-edit" className="btn btn-danger"
                                              title="Save My Details"
                                              onClick={() => this.unfollow()}>
                                          Unfollow
                                      </button>}
                                 </h2>
                                 <div className="wbdv-section-details">
                                     <ul>
                                         {this.state.followers && this.state.followers < 1 &&
                                          <li> This field lay barren. </li>}
                                         {this.state.followers.map(follow =>
                                           <li key={follow.userId}>
                                               <Link to={`/profile/${follow.userId}`}>
                                                   {follow.username}
                                               </Link>
                                           </li>
                                         )}
                                     </ul>
                                 </div>
                             </div>
                         </div>
                         <div className="col-md-8 wbdv-profile-right">
                             <div className="wbdv-profile-section">
                                 <h2 className="wbdv-section-title">Recent Activity</h2>
                                 {this.state.contents && this.state.contents < 1 &&
                                  <div className="wbdv-activity-details">
                                      No recent activity.
                                  </div>
                                 }
                                 {this.state.contents &&
                                  this.state.contents.map( content =>
                                       <div key={content.contentId}>
                                           {content.contentType === "QUOTATION" &&
                                            <div className="wbdv-activity-details">
                                                {content.contributor.username} posted a new quote on <Link to={`/word/${content.word.text}`}>
                                                {content.word.text}
                                            </Link>-- "{content.text}"
                                            </div>}
                                           {content.contentType === "SENTENCE" &&
                                            <div className="wbdv-activity-details">
                                                {content.contributor.username} posted a new sentence on <Link to={`/word/${content.word.text}`}>
                                                {content.word.text}
                                            </Link>-- "{content.text}"
                                            </div>}
                                           {content.contentType === "DEFINITION" &&
                                            <div className="wbdv-activity-details">
                                                {content.contributor.username} posted a new definition on <Link to={`/word/${content.word.text}`}>
                                                {content.word.text}
                                            </Link>-- "{content.text}"
                                            </div>}
                                           {content.contentType === "COMMENT" &&
                                            <div className="wbdv-activity-details">
                                                {content.contributor.username} posted a new comment on <Link to={`/word/${content.word.text}`}>
                                                {content.word.text}
                                            </Link>-- "{content.text}"
                                            </div>}
                                       </div>
                                  )}
                             </div>
                         </div>
                     </div>
                     <hr/>
                 </div>
                }
            </div>
        )
    }
}

export default ProfileViewOnlyComponent
