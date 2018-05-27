function renderMessage(name, message, isUser) {
  return `
    <h6 class="mb-0 ml-1 ${isUser ? 'text-right mr-2' : ''}">${name}:</h6>
    <div class="card ${
      isUser ? '' : 'amber-background'
    } z-depth-2 rounded-corner mb-2">
        <div class="card-body p-2">
            <p class="${isUser ? '' : 'white-text'} p-1 mb-0">
              ${message}
            </p>
        </div>
    </div>
  `;
}

$(document).ready(async function() {
  const { ChatManager, TokenProvider } = Chatkit;
  const { data } = await axios.get('/api/getme');
  let roomId;
  let loading;

  const sendMessage = async function(roomId, message, callback) {
    await currentUser.sendMessage({ roomId: parseInt(roomId), text: message });
    callback();
  };

  const chatManager = new ChatManager({
    instanceLocator: 'v1:us1:f7156a69-5e8f-4554-a08b-df33b7e4e39c',
    userId: data.username,
    tokenProvider: new TokenProvider({
      url: '/api/authenticate',
    }),
  });

  const currentUser = await chatManager.connect();

  $('#room-list a').click(async function(e) {
    $('#chat').attr('style', 'display:block');
    e.preventDefault();
    if ($(this).attr('room') === roomId) {
      return;
    }
    console.log(currentUser);
    roomId = $(this).attr('room');
    $(`#${roomId}-content`).empty();
    await currentUser.subscribeToRoom({
      roomId: parseInt(roomId),
      hooks: {
        onNewMessage: message => {
          const { senderId, text } = message;
          const div = $('<div>').html(
            renderMessage(senderId, text, currentUser.id === senderId)
          );
          $(`#${roomId}-content`).append(div);
          const height = '' + $(`#${roomId}-content:last-child`).height();
          // const height = '' + $(`#${roomId}`).prop("scrollHeight");
          console.log(height);
          $(`#${roomId}`).animate({ scrollTop: height }, 50);
          // $(`#${roomId}-content`).animate({ scrollTop: height });
        },
      },
      messageLimit: 100,
    });

    $(this).tab('show');
  });

  $('#input-message').on('keypress', function(e) {
    if (e.which === 13) {
      if (!$(this).val()) return;
      $(this).attr('disabled', 'disabled');
      sendMessage(roomId, $(this).val(), function() {
        $('#input-message').removeAttr('disabled');
        $('#input-message').val('');
      });
    }
  });

  $('#send-message').click(function() {
    if (loading || !$('#input-message').val()) return;
    loading = true;
    $('#input-message').attr('disabled', 'disabled');
    sendMessage(roomId, $('#input-message').val(), function() {
      $('#input-message').removeAttr('disabled');
      $('#input-message').val('');
      loading = false;
    });
  });
});
