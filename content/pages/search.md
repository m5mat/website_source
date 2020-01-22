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
      <div class="input-group mb-3">
        <input type="text" id="tipue_search_input" class="form-control" placeholder="Recipient's username" aria-label="Search" aria-describedby="basic-addon2">
        <div class="input-group-append">
          <button class="btn btn-outline-secondary" type="button">Search</button>
        </div>
      </div>

    </div>
    <div id="tipue_search_content"></div>
</div>
