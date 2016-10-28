bkts?.plugin 'location',
  name: 'Location'

  inputView: require './views/map'

  # Do this so any Handlebars templates we use
  # can share Buckets’ runtime (helpers, etc.)
  settingsView: """
    <div class="checkbox">
      <label>
        <input type="checkbox" name="useTitleForInput"> Use entry title as input
      </label>
    </div>

    <div class="form-group">
      <label for="inputPlaceholder">Placeholder text</label>
      <input type="text" name="placeholder" id="inputPlaceholder" class="form-control" value="Address, Zip, City, or Region">
    </div>
  """
