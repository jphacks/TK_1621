bkts?.plugin 'toggle',
  name: 'Toggle'

  inputView: require './views/toggle'
  settingsView: """
  """
  
  # settingsView: """
  # <div class="form-group">
  #   <label>On Color</label>
  #   <input type="text" name="color" class="form-control" value="<%= settings.color %>">
  #   <%
  #     console.log(settings);
  #   %>
  #   <div class="swatches colors">
  #       <div data-value="green" class="green"></div>
  #       <div data-value="teal" class="teal"></div>
  #       <div data-value="blue" class="blue"></div>
  #       <div data-value="purple" class="purple"></div>
  #       <div data-value="red" class="red"></div>
  #       <div data-value="orange" class="orange"></div>
  #       <div data-value="yellow" class="yellow"></div>
  #       <div data-value="gray" class="gray"></div>
  #   </div>
  # </div>
  # """
