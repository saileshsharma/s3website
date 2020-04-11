window.populateGreenhouseJobs = function(response)
{
  var jobs_to_display = [];
  $.each(response.jobs, function(key,job) {
    if(job.departments.length > 0)
    {
        var job_object = {
        title:  job.title,
        url:    job.absolute_url,
        location: job.location.name
        };
        jobs_to_display[job.departments[0].name] = jobs_to_display[job.departments[0].name] || [];
        jobs_to_display[job.departments[0].name].push(job_object);
    }
  });

  var jobsListContainer = document.getElementById('greenhouse-jobs')
  jobsListContainer.innerHTML = ''

  Object.keys(jobs_to_display)
    .sort()
    .forEach(function(key, i) {
      $('<h4 class="grid-col-12 u-padding-top-large u-padding-top-huge-md u-font-maison">' + key + '</h4>'
    ).appendTo(jobsListContainer);

    $.each(jobs_to_display[key],function(index,job) {
        $('<a href="'+job.url+'" title="External link to Greenhouse for ' + job.title + '" class="careers-greenhouse-link grid-col-12 grid-col-4-md o-box o-box--white"><span class="u-font-size-h4 u-width-full u-display-block">' + job.title + '</span><span class="u-margin-top-sm u-font-light u-color-grey-blue"><b>' + key + '</b></span><br><span class="u-margin-top-sm u-font-light u-color-grey-blue">' + job.location + '</span></a>').appendTo(jobsListContainer);
    });
  });
}
