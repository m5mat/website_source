Title: Search
Slug: search
Author: Matt, M5MAT

<script type="text/javascript" src="/media/tipuesearch/tipuesearch_set.js"></script>
<script type="text/javascript" src="/tipuesearch_content.js"></script>
<script type="text/javascript" src="/media/tipuesearch/tipuesearch.js"></script>

<script>
  $(document).ready(function() {
       $('#tipue_search_input').tipuesearch();
  });
</script>

<div class="entry-content">
    <div align="center">
      <form>
        <div class="input-group mb-3">
          <input type="text" name="q" id="tipue_search_input" class="form-control" placeholder="Search" aria-label="Search" aria-describedby="basic-addon2">
          <div class="input-group-append">
            <button class="btn btn-outline-secondary" type="submit">Search</button>
          </div>
        </div>
      </form>
    </div>
    <div id="tipue_search_content"></div>
</div>
