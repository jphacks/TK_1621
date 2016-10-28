bkts?.plugin 'markdown',
  name: 'Markdown'

  # Use a Chaplin (Backbone) view for the actual input
  inputView: require './views/markdown'

  # And simple HTML blob for the config
  settingsView: """
    <div class="form-group">
      <div class="checkbox">
        <label>
          <input type="checkbox" name="smartypants"<% if ((!settings.smartypants && typeof _id == "undefined") || settings.smartypants == 'on'){ %> checked<% } %>>
          Use <a href="http://daringfireball.net/projects/smartypants/" target="_blank">Smartypants</a>
          <span class="text-muted">(smart punctiation)</span>
        </label>
      </div>

      <div class="checkbox">
        <label>
          <input type="checkbox" name="highlight"<% if ((!settings.highlight && typeof _id == "undefined") || settings.highlight == 'on'){ %> checked<% } %>>
          Syntax highlight code blocks
        </label>
      </div>

      <label class="input-label">Size</label>
      <select name="size" class="form-control">
        <option value="lg"<% if (settings.size == 'lg'){ %> selected<% } %>>Large</option>
        <option value="sm"<% if (settings.size == 'sm'){ %> selected<% } %>>Small</option>
      </select>
    </div>
    """
