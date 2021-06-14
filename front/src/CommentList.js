import axios from 'axios';
import React, {Component} from 'react';
import { Table } from "react-bootstrap";
import {} from "jquery.cookie";
axios.defaults.withCredentials = true;
const headers = { withCredentials: true };

class CommentRow extends Component {
    render() {
        return (
            <tr>
                <td>{this.props.content}</td>
            </tr>
        );
    }
}

class CommentList extends Component{

  state = {
      boardList: []
  };

  componentWillMount() {
    this.getCommentList();
  }

  getCommentList = () => {
    const postId = this.props.postId;
    const send_param = {
      headers,
      postId
    };

    axios
        .post("http://localhost:8080/comment/getCommentList", send_param)
        .then(returnData => {
            let commentList;
            if (returnData.data.list.length > 0) {
              const comments = returnData.data.list;
              commentList = comments.map(item=>(
                  <CommentRow key={item.content} content={item.content}></CommentRow>
              ));
              console.log(commentList);
              this.setState({
                commentList: commentList
              });
            }
          })
        .catch(err => {
          console.log(err);
        });
  };
  render() {
    return (
        <div>
            <br />
            <p>댓글</p>
            <hr />

            {/* Comment Lists */}
            <Table bordered hover>
                <tbody>{this.state.commentList}</tbody>
            </Table>
        </div>
    );
  }

}

export default CommentList;
