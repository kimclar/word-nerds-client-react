import React from 'react';

class CommentInputComponent extends React.Component {

    state = {
        userId: this.props.profile.userId,
        word: this.props.word,
        content : {
            contentType: 1,
            text: "",
            book: "",
            author: "",
        }
    }

    addContent () {
        if (this.props.profile.userType === "PUBLIC"){
            alert("You must be logged in to perform this action!")
        } else {
            if (this.state.content.text === "") {
                alert("Please fill in the field and try again!")
            } else {
                this.setState(
                    {content:
                            {...this.state.content,
                                text: ""}})
                this.props.createComment(this.state.content, this.props.profile.userId, this.props.word)
            }
        }
    }

    render(){
        return(
            <div className="wbdv-input-div container">
                <textarea className="container wbdv-input-data" title="Comment"
                          placeholder="Add a new comment here..." value={this.state.content.text}
                          onChange={(e) => this.setState(
                              {content:
                                      {...this.state.content,
                                          text: e.target.value}})}/>
                <button className="container btn btn-success"
                        onClick={() => this.addContent()}>
                    Add New Comment
                </button>
            </div>
        )
    }
}

export default CommentInputComponent
