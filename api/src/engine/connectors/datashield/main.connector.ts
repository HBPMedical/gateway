import { HttpService } from '@nestjs/axios';
import { Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { IncomingMessage } from 'http';
import { firstValueFrom, Observable } from 'rxjs';
import { ENGINE_MODULE_OPTIONS } from 'src/engine/engine.constants';
import { IEngineOptions, IEngineService } from 'src/engine/engine.interfaces';
import { Domain } from 'src/engine/models/domain.model';
import { Algorithm } from 'src/engine/models/experiment/algorithm.model';
import {
  Experiment,
  PartialExperiment,
} from 'src/engine/models/experiment/experiment.model';
import { ExperimentCreateInput } from 'src/engine/models/experiment/input/experiment-create.input';
import { ExperimentEditInput } from 'src/engine/models/experiment/input/experiment-edit.input';
import { ListExperiments } from 'src/engine/models/experiment/list-experiments.model';
import { RawResult } from 'src/engine/models/result/raw-result.model';

const test: Domain = {
  id: 'sophia',
  datasets: [
    {
      id: 'server1',
      label: 'server1',
    },
    {
      id: 'server2',
      label: 'server2',
    },
  ],
  rootGroup: {
    id: 'rootGroup',
    label: 'Root group',
    groups: ['measurement', 'observation', 'person', 'cohorts'],
  },
  groups: [
    {
      id: 'measurement',
      label: 'measurement',
      variables: [
        'Alanine.aminotransferase..Enzymatic.activity.volume..in.Serum.or.Plasma',
        'Albumin..Mass.volume..in.Serum.or.Plasma',
        'Alkaline.phosphatase..Enzymatic.activity.volume..in.Serum.or.Plasma',
        'American.house.dust.mite.IgE.Ab..Units.volume..in.Serum',
        'Aspartate.aminotransferase..Enzymatic.activity.volume..in.Serum.or.Plasma',
        'Basophils....volume..in.Blood.by.Automated.count',
        'Basophils.100.leukocytes.in.Blood.by.Automated.count',
        'Bicarbonate..Moles.volume..in.Arterial.blood',
        'Bilirubin.total..Mass.volume..in.Serum.or.Plasma',
        'Bilirubin.total..Mass.volume..in.Urine.by.Test.strip',
        'Body.height',
        'Body.mass.index..BMI...Percentile..Per.age.and.sex',
        'Body.mass.index..BMI...Ratio.',
        'Body.temperature',
        'Body.weight',
        'C.reactive.protein..Mass.volume..in.Serum.or.Plasma',
        'Calcium..Mass.volume..in.Blood',
        'Calcium..Mass.volume..in.Serum.or.Plasma',
        'Carbon.dioxide..Partial.pressure..in.Arterial.blood',
        'Carbon.dioxide..total..Moles.volume..in.Blood',
        'Carbon.dioxide..total..Moles.volume..in.Serum.or.Plasma',
        'Cat.dander.IgE.Ab..Units.volume..in.Serum',
        'Chloride..Moles.volume..in.Blood',
        'Chloride..Moles.volume..in.Serum.or.Plasma',
        'Cholesterol..Mass.volume..in.Serum.or.Plasma',
        'Cholesterol.in.HDL..Mass.volume..in.Serum.or.Plasma',
        'Cholesterol.in.LDL..Mass.volume..in.Serum.or.Plasma.by.Direct.assay',
        'Cladosporium.herbarum.IgE.Ab..Units.volume..in.Serum',
        'Codfish.IgE.Ab..Units.volume..in.Serum',
        'Common.Ragweed.IgE.Ab..Units.volume..in.Serum',
        'Cow.milk.IgE.Ab..Units.volume..in.Serum',
        'Creatine.kinase..Enzymatic.activity.volume..in.Serum.or.Plasma',
        'Creatinine..Mass.volume..in.Blood',
        'Creatinine..Mass.volume..in.Serum.or.Plasma',
        'Diastolic.blood.pressure',
        'DXA.Radius.and.Ulna..T.score..Bone.density',
        'Egg.white.IgE.Ab..Units.volume..in.Serum',
        'Eosinophils....volume..in.Blood.by.Automated.count',
        'Eosinophils.100.leukocytes.in.Blood.by.Automated.count',
        'Erythrocyte.distribution.width..Entitic.volume..by.Automated.count',
        'Erythrocyte.distribution.width..Ratio..by.Automated.count',
        'Erythrocytes....volume..in.Blood.by.Automated.count',
        'Ferritin..Mass.volume..in.Serum.or.Plasma',
        'FEV1.FVC',
        'Fibrin.D.dimer.FEU..Mass.volume..in.Platelet.poor.plasma',
        'Globulin..Mass.volume..in.Serum.by.calculation',
        'Glomerular.filtration.rate.1.73.sq.M.predicted..Volume.Rate.Area..in.Serum..Plasma.or.Blood.by.Creatinine.based.formula..MDRD.',
        'Glucose..Mass.volume..in.Blood',
        'Glucose..Mass.volume..in.Serum.or.Plasma',
        'Glucose..Mass.volume..in.Urine.by.Test.strip',
        'Head.Occipital.frontal.circumference',
        'Heart.rate',
        'Hematocrit..Volume.Fraction..of.Blood',
        'Hematocrit..Volume.Fraction..of.Blood.by.Automated.count',
        'Hemoglobin..Mass.volume..in.Blood',
        'Hemoglobin.A1c.Hemoglobin.total.in.Blood',
        'Hemoglobin.gastrointestinal.lower..Presence..in.Stool.by.Immunoassay...1st.specimen',
        'Honey.bee.IgE.Ab..Units.volume..in.Serum',
        'INR.in.Platelet.poor.plasma.by.Coagulation.assay',
        'Ketones..Mass.volume..in.Urine.by.Test.strip',
        'Lactate.dehydrogenase..Enzymatic.activity.volume..in.Serum.or.Plasma.by.Lactate.to.pyruvate.reaction',
        'Latex.IgE.Ab..Units.volume..in.Serum',
        'Left.ventricular.Ejection.fraction',
        'Leukocytes....volume..in.Blood.by.Automated.count',
        'Lymph.nodes.with.isolated.tumor.cells.....in.Cancer.specimen.by.Light.microscopy',
        'Lymphocytes....volume..in.Blood.by.Automated.count',
        'Lymphocytes.100.leukocytes.in.Blood.by.Automated.count',
        'MCH..Entitic.mass..by.Automated.count',
        'MCHC..Mass.volume..by.Automated.count',
        'MCV..Entitic.volume..by.Automated.count',
        'Microalbumin.Creatinine..Mass.Ratio..in.Urine',
        'Monocytes....volume..in.Blood.by.Automated.count',
        'Monocytes.100.leukocytes.in.Blood.by.Automated.count',
        'Natriuretic.peptide.B.prohormone.N.Terminal..Mass.volume..in.Serum.or.Plasma',
        'Neutrophils....volume..in.Blood.by.Automated.count',
        'Neutrophils.100.leukocytes.in.Blood.by.Automated.count',
        'Oxygen..Partial.pressure..in.Arterial.blood',
        'Oxygen.saturation.in.Arterial.blood',
        'Oxygen.Inspired.gas.setting..Volume.Fraction..Ventilator',
        'Pain.severity...0.10.verbal.numeric.rating..Score....Reported',
        'Peanut.IgE.Ab..Units.volume..in.Serum',
        'Percentage.area.affected.by.eczema.Head.and.Neck..PhenX.',
        'Percentage.area.affected.by.eczema.Lower.extremity...bilateral..PhenX.',
        'Percentage.area.affected.by.eczema.Trunk..PhenX.',
        'Percentage.area.affected.by.eczema.Upper.extremity...bilateral..PhenX.',
        'pH.of.Arterial.blood',
        'pH.of.Urine.by.Test.strip',
        'Platelet.distribution.width..Entitic.volume..in.Blood.by.Automated.count',
        'Platelet.mean.volume..Entitic.volume..in.Blood.by.Automated.count',
        'Platelets....volume..in.Blood.by.Automated.count',
        'Polyp.size.greatest.dimension',
        'Potassium..Moles.volume..in.Blood',
        'Potassium..Moles.volume..in.Serum.or.Plasma',
        'Procalcitonin..Mass.volume..in.Serum.or.Plasma',
        'Prostate.specific.Ag..Mass.volume..in.Serum.or.Plasma',
        'Protein..Mass.volume..in.Serum.or.Plasma',
        'Protein..Mass.volume..in.Urine.by.Test.strip',
        'Prothrombin.time..PT.',
        'Quality.adjusted.life.years',
        'Quality.of.life.scale',
        'Respiratory.rate',
        'Shrimp.IgE.Ab..Units.volume..in.Serum',
        'Size.maximum.dimension.in.Tumor',
        'Sodium..Moles.volume..in.Blood',
        'Sodium..Moles.volume..in.Serum.or.Plasma',
        'Soybean.IgE.Ab..Units.volume..in.Serum',
        'Specific.gravity.of.Urine.by.Test.strip',
        'Systolic.blood.pressure',
        'Thyrotropin..Units.volume..in.Serum.or.Plasma',
        'Thyroxine..T4..free..Mass.volume..in.Serum.or.Plasma',
        'Triglyceride..Mass.volume..in.Serum.or.Plasma',
        'Troponin.I.cardiac..Mass.volume..in.Serum.or.Plasma.by.High.sensitivity.method',
        'Urea.nitrogen..Mass.volume..in.Blood',
        'Urea.nitrogen..Mass.volume..in.Serum.or.Plasma',
        'Walnut.IgE.Ab..Units.volume..in.Serum',
        'Weight.difference..Mass.difference....pre.dialysis...post.dialysis',
        'Weight.for.length.Per.age.and.sex',
        'Wheat.IgE.Ab..Units.volume..in.Serum',
        'White.Oak.IgE.Ab..Units.volume..in.Serum',
        'Anion.gap.in.Serum.or.Plasma',
        'Bilirubin.total..Mass.volume..in.Blood',
        'Erythrocyte.distribution.width..Ratio.',
        'Erythrocytes....volume..in.Blood',
        'Interleukin.6..Mass.volume..in.Serum.or.Plasma',
        'Leukocytes....volume..in.Blood',
        'Lymph.nodes.with.macrometastases.....in.Cancer.specimen.by.Light.microscopy',
        'Lymph.nodes.with.micrometastases.....in.Cancer.specimen.by.Light.microscopy',
        'MCV..Entitic.volume.',
        'Platelets....volume..in.Blood',
      ],
    },
    {
      id: 'observation',
      label: 'observation',
      variables: [
        'Abuse.Status..OMAHA.',
        'Allergy.to.animal.dander',
        'Allergy.to.bee.venom',
        'Allergy.to.dairy.foods',
        'Allergy.to.dust.mite.protein',
        'Allergy.to.edible.egg',
        'Allergy.to.fish',
        'Allergy.to.grass.pollen',
        'Allergy.to.latex',
        'Allergy.to.mold',
        'Allergy.to.nut',
        'Allergy.to.peanut',
        'Allergy.to.shellfish',
        'Allergy.to.soy.protein',
        'Allergy.to.tree.pollen',
        'Allergy.to.wheat',
        'Are.you.covered.by.health.insurance.or.some.other.kind.of.health.care.plan..PhenX.',
        'Body.mass.index.30....obesity',
        'Body.mass.index.40....severely.obese',
        'Burn.injury',
        'Cause.of.death..US.Standard.Certificate.of.Death.',
        'History.of.appendectomy',
        'History.of.cardiac.arrest',
        'History.of.Hospitalizations.Outpatient.visits.Narrative',
        'History.of.myocardial.infarction',
        'History.of.single.seizure',
        'HIV.status',
        'Housing.status',
        'No.matching.concept',
        'Response.to.cancer.treatment',
        'Sexual.orientation',
        'Smokes.tobacco.daily',
        'Suspected.disease.caused.by.2019.nCoV',
        'Suspected.lung.cancer',
        'Tobacco.smoking.status',
        'Total.score..MMSE.',
        'VR.12.Bodily.pain..BP..score...oblique.method',
        'VR.12.General.health..GH..score...oblique.method',
        'VR.12.Mental.health..MH..score...oblique.method',
        'VR.12.Physical.functioning..PF..score...oblique.method',
        'VR.12.Role.emotion..RE..score...oblique.method',
        'VR.12.Role.physical..RP..score...oblique.method',
        'VR.12.Social.functioning..SF..score...oblique.method',
        'VR.12.Vitality..VT..score...oblique.method',
      ],
    },
    {
      id: 'person',
      label: 'person',
      variables: ['date_of_birth', 'gender', 'race', 'ethnicity'],
    },
    {
      id: 'cohorts',
      label: 'Cohorts',
      variables: ['omop_test', 'test', 'sophia'],
    },
  ],
  variables: [
    {
      id: 'Alanine.aminotransferase..Enzymatic.activity.volume..in.Serum.or.Plasma',
      label:
        'Alanine aminotransferase Enzymatic activity volume in Serum or Plasma',
      type: 'Number',
    },
    {
      id: 'Albumin..Mass.volume..in.Serum.or.Plasma',
      label: 'Albumin Mass volume in Serum or Plasma',
      type: 'Number',
    },
    {
      id: 'Alkaline.phosphatase..Enzymatic.activity.volume..in.Serum.or.Plasma',
      label:
        'Alkaline phosphatase Enzymatic activity volume in Serum or Plasma',
      type: 'Number',
    },
    {
      id: 'American.house.dust.mite.IgE.Ab..Units.volume..in.Serum',
      label: 'American house dust mite IgE Ab Units volume in Serum',
      type: 'Number',
    },
    {
      id: 'Aspartate.aminotransferase..Enzymatic.activity.volume..in.Serum.or.Plasma',
      label:
        'Aspartate aminotransferase Enzymatic activity volume in Serum or Plasma',
      type: 'Number',
    },
    {
      id: 'Basophils....volume..in.Blood.by.Automated.count',
      label: 'Basophils volume in Blood by Automated count',
      type: 'Number',
    },
    {
      id: 'Basophils.100.leukocytes.in.Blood.by.Automated.count',
      label: 'Basophils 100 leukocytes in Blood by Automated count',
      type: 'Number',
    },
    {
      id: 'Bicarbonate..Moles.volume..in.Arterial.blood',
      label: 'Bicarbonate Moles volume in Arterial blood',
      type: 'Number',
    },
    {
      id: 'Bilirubin.total..Mass.volume..in.Serum.or.Plasma',
      label: 'Bilirubin total Mass volume in Serum or Plasma',
      type: 'Number',
    },
    {
      id: 'Bilirubin.total..Mass.volume..in.Urine.by.Test.strip',
      label: 'Bilirubin total Mass volume in Urine by Test strip',
      type: 'Number',
    },
    {
      id: 'Body.height',
      label: 'Body height',
      type: 'Number',
    },
    {
      id: 'Body.mass.index..BMI...Percentile..Per.age.and.sex',
      label: 'Body mass index BMI Percentile Per age and sex',
      type: 'Number',
    },
    {
      id: 'Body.mass.index..BMI...Ratio.',
      label: 'Body mass index BMI Ratio',
      type: 'Number',
    },
    {
      id: 'Body.temperature',
      label: 'Body temperature',
      type: 'Number',
    },
    {
      id: 'Body.weight',
      label: 'Body weight',
      type: 'Number',
    },
    {
      id: 'C.reactive.protein..Mass.volume..in.Serum.or.Plasma',
      label: 'C reactive protein Mass volume in Serum or Plasma',
      type: 'Number',
    },
    {
      id: 'Calcium..Mass.volume..in.Blood',
      label: 'Calcium Mass volume in Blood',
      type: 'Number',
    },
    {
      id: 'Calcium..Mass.volume..in.Serum.or.Plasma',
      label: 'Calcium Mass volume in Serum or Plasma',
      type: 'Number',
    },
    {
      id: 'Carbon.dioxide..Partial.pressure..in.Arterial.blood',
      label: 'Carbon dioxide Partial pressure in Arterial blood',
      type: 'Number',
    },
    {
      id: 'Carbon.dioxide..total..Moles.volume..in.Blood',
      label: 'Carbon dioxide total Moles volume in Blood',
      type: 'Number',
    },
    {
      id: 'Carbon.dioxide..total..Moles.volume..in.Serum.or.Plasma',
      label: 'Carbon dioxide total Moles volume in Serum or Plasma',
      type: 'Number',
    },
    {
      id: 'Cat.dander.IgE.Ab..Units.volume..in.Serum',
      label: 'Cat dander IgE Ab Units volume in Serum',
      type: 'Number',
    },
    {
      id: 'Chloride..Moles.volume..in.Blood',
      label: 'Chloride Moles volume in Blood',
      type: 'Number',
    },
    {
      id: 'Chloride..Moles.volume..in.Serum.or.Plasma',
      label: 'Chloride Moles volume in Serum or Plasma',
      type: 'Number',
    },
    {
      id: 'Cholesterol..Mass.volume..in.Serum.or.Plasma',
      label: 'Cholesterol Mass volume in Serum or Plasma',
      type: 'Number',
    },
    {
      id: 'Cholesterol.in.HDL..Mass.volume..in.Serum.or.Plasma',
      label: 'Cholesterol in HDL Mass volume in Serum or Plasma',
      type: 'Number',
    },
    {
      id: 'Cholesterol.in.LDL..Mass.volume..in.Serum.or.Plasma.by.Direct.assay',
      label:
        'Cholesterol in LDL Mass volume in Serum or Plasma by Direct assay',
      type: 'Number',
    },
    {
      id: 'Cladosporium.herbarum.IgE.Ab..Units.volume..in.Serum',
      label: 'Cladosporium herbarum IgE Ab Units volume in Serum',
      type: 'Number',
    },
    {
      id: 'Codfish.IgE.Ab..Units.volume..in.Serum',
      label: 'Codfish IgE Ab Units volume in Serum',
      type: 'Number',
    },
    {
      id: 'Common.Ragweed.IgE.Ab..Units.volume..in.Serum',
      label: 'Common Ragweed IgE Ab Units volume in Serum',
      type: 'Number',
    },
    {
      id: 'Cow.milk.IgE.Ab..Units.volume..in.Serum',
      label: 'Cow milk IgE Ab Units volume in Serum',
      type: 'Number',
    },
    {
      id: 'Creatine.kinase..Enzymatic.activity.volume..in.Serum.or.Plasma',
      label: 'Creatine kinase Enzymatic activity volume in Serum or Plasma',
      type: 'Number',
    },
    {
      id: 'Creatinine..Mass.volume..in.Blood',
      label: 'Creatinine Mass volume in Blood',
      type: 'Number',
    },
    {
      id: 'Creatinine..Mass.volume..in.Serum.or.Plasma',
      label: 'Creatinine Mass volume in Serum or Plasma',
      type: 'Number',
    },
    {
      id: 'Diastolic.blood.pressure',
      label: 'Diastolic blood pressure',
      type: 'Number',
    },
    {
      id: 'DXA.Radius.and.Ulna..T.score..Bone.density',
      label: 'DXA Radius and Ulna T score Bone density',
      type: 'Number',
    },
    {
      id: 'Egg.white.IgE.Ab..Units.volume..in.Serum',
      label: 'Egg white IgE Ab Units volume in Serum',
      type: 'Number',
    },
    {
      id: 'Eosinophils....volume..in.Blood.by.Automated.count',
      label: 'Eosinophils volume in Blood by Automated count',
      type: 'Number',
    },
    {
      id: 'Eosinophils.100.leukocytes.in.Blood.by.Automated.count',
      label: 'Eosinophils 100 leukocytes in Blood by Automated count',
      type: 'Number',
    },
    {
      id: 'Erythrocyte.distribution.width..Entitic.volume..by.Automated.count',
      label: 'Erythrocyte distribution width Entitic volume by Automated count',
      type: 'Number',
    },
    {
      id: 'Erythrocyte.distribution.width..Ratio..by.Automated.count',
      label: 'Erythrocyte distribution width Ratio by Automated count',
      type: 'Number',
    },
    {
      id: 'Erythrocytes....volume..in.Blood.by.Automated.count',
      label: 'Erythrocytes volume in Blood by Automated count',
      type: 'Number',
    },
    {
      id: 'Ferritin..Mass.volume..in.Serum.or.Plasma',
      label: 'Ferritin Mass volume in Serum or Plasma',
      type: 'Number',
    },
    {
      id: 'FEV1.FVC',
      label: 'FEV1 FVC',
      type: 'Number',
    },
    {
      id: 'Fibrin.D.dimer.FEU..Mass.volume..in.Platelet.poor.plasma',
      label: 'Fibrin D dimer FEU Mass volume in Platelet poor plasma',
      type: 'Number',
    },
    {
      id: 'Globulin..Mass.volume..in.Serum.by.calculation',
      label: 'Globulin Mass volume in Serum by calculation',
      type: 'Number',
    },
    {
      id: 'Glomerular.filtration.rate.1.73.sq.M.predicted..Volume.Rate.Area..in.Serum..Plasma.or.Blood.by.Creatinine.based.formula..MDRD.',
      label:
        'Glomerular filtration rate 1 73 sq M predicted Volume Rate Area in Serum Plasma or Blood by Creatinine based formula MDRD',
      type: 'Number',
    },
    {
      id: 'Glucose..Mass.volume..in.Blood',
      label: 'Glucose Mass volume in Blood',
      type: 'Number',
    },
    {
      id: 'Glucose..Mass.volume..in.Serum.or.Plasma',
      label: 'Glucose Mass volume in Serum or Plasma',
      type: 'Number',
    },
    {
      id: 'Glucose..Mass.volume..in.Urine.by.Test.strip',
      label: 'Glucose Mass volume in Urine by Test strip',
      type: 'Number',
    },
    {
      id: 'Head.Occipital.frontal.circumference',
      label: 'Head Occipital frontal circumference',
      type: 'Number',
    },
    {
      id: 'Heart.rate',
      label: 'Heart rate',
      type: 'Number',
    },
    {
      id: 'Hematocrit..Volume.Fraction..of.Blood',
      label: 'Hematocrit Volume Fraction of Blood',
      type: 'Number',
    },
    {
      id: 'Hematocrit..Volume.Fraction..of.Blood.by.Automated.count',
      label: 'Hematocrit Volume Fraction of Blood by Automated count',
      type: 'Number',
    },
    {
      id: 'Hemoglobin..Mass.volume..in.Blood',
      label: 'Hemoglobin Mass volume in Blood',
      type: 'Number',
    },
    {
      id: 'Hemoglobin.A1c.Hemoglobin.total.in.Blood',
      label: 'Hemoglobin A1c Hemoglobin total in Blood',
      type: 'Number',
    },
    {
      id: 'Hemoglobin.gastrointestinal.lower..Presence..in.Stool.by.Immunoassay...1st.specimen',
      label:
        'Hemoglobin gastrointestinal lower Presence in Stool by Immunoassay 1st specimen',
      type: 'Number',
    },
    {
      id: 'Honey.bee.IgE.Ab..Units.volume..in.Serum',
      label: 'Honey bee IgE Ab Units volume in Serum',
      type: 'Number',
    },
    {
      id: 'INR.in.Platelet.poor.plasma.by.Coagulation.assay',
      label: 'INR in Platelet poor plasma by Coagulation assay',
      type: 'Number',
    },
    {
      id: 'Ketones..Mass.volume..in.Urine.by.Test.strip',
      label: 'Ketones Mass volume in Urine by Test strip',
      type: 'Number',
    },
    {
      id: 'Lactate.dehydrogenase..Enzymatic.activity.volume..in.Serum.or.Plasma.by.Lactate.to.pyruvate.reaction',
      label:
        'Lactate dehydrogenase Enzymatic activity volume in Serum or Plasma by Lactate to pyruvate reaction',
      type: 'Number',
    },
    {
      id: 'Latex.IgE.Ab..Units.volume..in.Serum',
      label: 'Latex IgE Ab Units volume in Serum',
      type: 'Number',
    },
    {
      id: 'Left.ventricular.Ejection.fraction',
      label: 'Left ventricular Ejection fraction',
      type: 'Number',
    },
    {
      id: 'Leukocytes....volume..in.Blood.by.Automated.count',
      label: 'Leukocytes volume in Blood by Automated count',
      type: 'Number',
    },
    {
      id: 'Lymph.nodes.with.isolated.tumor.cells.....in.Cancer.specimen.by.Light.microscopy',
      label:
        'Lymph nodes with isolated tumor cells in Cancer specimen by Light microscopy',
      type: 'Number',
    },
    {
      id: 'Lymphocytes....volume..in.Blood.by.Automated.count',
      label: 'Lymphocytes volume in Blood by Automated count',
      type: 'Number',
    },
    {
      id: 'Lymphocytes.100.leukocytes.in.Blood.by.Automated.count',
      label: 'Lymphocytes 100 leukocytes in Blood by Automated count',
      type: 'Number',
    },
    {
      id: 'MCH..Entitic.mass..by.Automated.count',
      label: 'MCH Entitic mass by Automated count',
      type: 'Number',
    },
    {
      id: 'MCHC..Mass.volume..by.Automated.count',
      label: 'MCHC Mass volume by Automated count',
      type: 'Number',
    },
    {
      id: 'MCV..Entitic.volume..by.Automated.count',
      label: 'MCV Entitic volume by Automated count',
      type: 'Number',
    },
    {
      id: 'Microalbumin.Creatinine..Mass.Ratio..in.Urine',
      label: 'Microalbumin Creatinine Mass Ratio in Urine',
      type: 'Number',
    },
    {
      id: 'Monocytes....volume..in.Blood.by.Automated.count',
      label: 'Monocytes volume in Blood by Automated count',
      type: 'Number',
    },
    {
      id: 'Monocytes.100.leukocytes.in.Blood.by.Automated.count',
      label: 'Monocytes 100 leukocytes in Blood by Automated count',
      type: 'Number',
    },
    {
      id: 'Natriuretic.peptide.B.prohormone.N.Terminal..Mass.volume..in.Serum.or.Plasma',
      label:
        'Natriuretic peptide B prohormone N Terminal Mass volume in Serum or Plasma',
      type: 'Number',
    },
    {
      id: 'Neutrophils....volume..in.Blood.by.Automated.count',
      label: 'Neutrophils volume in Blood by Automated count',
      type: 'Number',
    },
    {
      id: 'Neutrophils.100.leukocytes.in.Blood.by.Automated.count',
      label: 'Neutrophils 100 leukocytes in Blood by Automated count',
      type: 'Number',
    },
    {
      id: 'Oxygen..Partial.pressure..in.Arterial.blood',
      label: 'Oxygen Partial pressure in Arterial blood',
      type: 'Number',
    },
    {
      id: 'Oxygen.saturation.in.Arterial.blood',
      label: 'Oxygen saturation in Arterial blood',
      type: 'Number',
    },
    {
      id: 'Oxygen.Inspired.gas.setting..Volume.Fraction..Ventilator',
      label: 'Oxygen Inspired gas setting Volume Fraction Ventilator',
      type: 'Number',
    },
    {
      id: 'Pain.severity...0.10.verbal.numeric.rating..Score....Reported',
      label: 'Pain severity 0 10 verbal numeric rating Score Reported',
      type: 'Number',
    },
    {
      id: 'Peanut.IgE.Ab..Units.volume..in.Serum',
      label: 'Peanut IgE Ab Units volume in Serum',
      type: 'Number',
    },
    {
      id: 'Percentage.area.affected.by.eczema.Head.and.Neck..PhenX.',
      label: 'Percentage area affected by eczema Head and Neck PhenX',
      type: 'Number',
    },
    {
      id: 'Percentage.area.affected.by.eczema.Lower.extremity...bilateral..PhenX.',
      label:
        'Percentage area affected by eczema Lower extremity bilateral PhenX',
      type: 'Number',
    },
    {
      id: 'Percentage.area.affected.by.eczema.Trunk..PhenX.',
      label: 'Percentage area affected by eczema Trunk PhenX',
      type: 'Number',
    },
    {
      id: 'Percentage.area.affected.by.eczema.Upper.extremity...bilateral..PhenX.',
      label:
        'Percentage area affected by eczema Upper extremity bilateral PhenX',
      type: 'Number',
    },
    {
      id: 'pH.of.Arterial.blood',
      label: 'pH of Arterial blood',
      type: 'Number',
    },
    {
      id: 'pH.of.Urine.by.Test.strip',
      label: 'pH of Urine by Test strip',
      type: 'Number',
    },
    {
      id: 'Platelet.distribution.width..Entitic.volume..in.Blood.by.Automated.count',
      label:
        'Platelet distribution width Entitic volume in Blood by Automated count',
      type: 'Number',
    },
    {
      id: 'Platelet.mean.volume..Entitic.volume..in.Blood.by.Automated.count',
      label: 'Platelet mean volume Entitic volume in Blood by Automated count',
      type: 'Number',
    },
    {
      id: 'Platelets....volume..in.Blood.by.Automated.count',
      label: 'Platelets volume in Blood by Automated count',
      type: 'Number',
    },
    {
      id: 'Polyp.size.greatest.dimension',
      label: 'Polyp size greatest dimension',
      type: 'Number',
    },
    {
      id: 'Potassium..Moles.volume..in.Blood',
      label: 'Potassium Moles volume in Blood',
      type: 'Number',
    },
    {
      id: 'Potassium..Moles.volume..in.Serum.or.Plasma',
      label: 'Potassium Moles volume in Serum or Plasma',
      type: 'Number',
    },
    {
      id: 'Procalcitonin..Mass.volume..in.Serum.or.Plasma',
      label: 'Procalcitonin Mass volume in Serum or Plasma',
      type: 'Number',
    },
    {
      id: 'Prostate.specific.Ag..Mass.volume..in.Serum.or.Plasma',
      label: 'Prostate specific Ag Mass volume in Serum or Plasma',
      type: 'Number',
    },
    {
      id: 'Protein..Mass.volume..in.Serum.or.Plasma',
      label: 'Protein Mass volume in Serum or Plasma',
      type: 'Number',
    },
    {
      id: 'Protein..Mass.volume..in.Urine.by.Test.strip',
      label: 'Protein Mass volume in Urine by Test strip',
      type: 'Number',
    },
    {
      id: 'Prothrombin.time..PT.',
      label: 'Prothrombin time PT',
      type: 'Number',
    },
    {
      id: 'Quality.adjusted.life.years',
      label: 'Quality adjusted life years',
      type: 'Number',
    },
    {
      id: 'Quality.of.life.scale',
      label: 'Quality of life scale',
      type: 'Number',
    },
    {
      id: 'Respiratory.rate',
      label: 'Respiratory rate',
      type: 'Number',
    },
    {
      id: 'Shrimp.IgE.Ab..Units.volume..in.Serum',
      label: 'Shrimp IgE Ab Units volume in Serum',
      type: 'Number',
    },
    {
      id: 'Size.maximum.dimension.in.Tumor',
      label: 'Size maximum dimension in Tumor',
      type: 'Number',
    },
    {
      id: 'Sodium..Moles.volume..in.Blood',
      label: 'Sodium Moles volume in Blood',
      type: 'Number',
    },
    {
      id: 'Sodium..Moles.volume..in.Serum.or.Plasma',
      label: 'Sodium Moles volume in Serum or Plasma',
      type: 'Number',
    },
    {
      id: 'Soybean.IgE.Ab..Units.volume..in.Serum',
      label: 'Soybean IgE Ab Units volume in Serum',
      type: 'Number',
    },
    {
      id: 'Specific.gravity.of.Urine.by.Test.strip',
      label: 'Specific gravity of Urine by Test strip',
      type: 'Number',
    },
    {
      id: 'Systolic.blood.pressure',
      label: 'Systolic blood pressure',
      type: 'Number',
    },
    {
      id: 'Thyrotropin..Units.volume..in.Serum.or.Plasma',
      label: 'Thyrotropin Units volume in Serum or Plasma',
      type: 'Number',
    },
    {
      id: 'Thyroxine..T4..free..Mass.volume..in.Serum.or.Plasma',
      label: 'Thyroxine T4 free Mass volume in Serum or Plasma',
      type: 'Number',
    },
    {
      id: 'Triglyceride..Mass.volume..in.Serum.or.Plasma',
      label: 'Triglyceride Mass volume in Serum or Plasma',
      type: 'Number',
    },
    {
      id: 'Troponin.I.cardiac..Mass.volume..in.Serum.or.Plasma.by.High.sensitivity.method',
      label:
        'Troponin I cardiac Mass volume in Serum or Plasma by High sensitivity method',
      type: 'Number',
    },
    {
      id: 'Urea.nitrogen..Mass.volume..in.Blood',
      label: 'Urea nitrogen Mass volume in Blood',
      type: 'Number',
    },
    {
      id: 'Urea.nitrogen..Mass.volume..in.Serum.or.Plasma',
      label: 'Urea nitrogen Mass volume in Serum or Plasma',
      type: 'Number',
    },
    {
      id: 'Walnut.IgE.Ab..Units.volume..in.Serum',
      label: 'Walnut IgE Ab Units volume in Serum',
      type: 'Number',
    },
    {
      id: 'Weight.difference..Mass.difference....pre.dialysis...post.dialysis',
      label: 'Weight difference Mass difference pre dialysis post dialysis',
      type: 'Number',
    },
    {
      id: 'Weight.for.length.Per.age.and.sex',
      label: 'Weight for length Per age and sex',
      type: 'Number',
    },
    {
      id: 'Wheat.IgE.Ab..Units.volume..in.Serum',
      label: 'Wheat IgE Ab Units volume in Serum',
      type: 'Number',
    },
    {
      id: 'White.Oak.IgE.Ab..Units.volume..in.Serum',
      label: 'White Oak IgE Ab Units volume in Serum',
      type: 'Number',
    },
    {
      id: 'Anion.gap.in.Serum.or.Plasma',
      label: 'Anion gap in Serum or Plasma',
      type: 'Number',
    },
    {
      id: 'Bilirubin.total..Mass.volume..in.Blood',
      label: 'Bilirubin total Mass volume in Blood',
      type: 'Number',
    },
    {
      id: 'Erythrocyte.distribution.width..Ratio.',
      label: 'Erythrocyte distribution width Ratio',
      type: 'Number',
    },
    {
      id: 'Erythrocytes....volume..in.Blood',
      label: 'Erythrocytes volume in Blood',
      type: 'Number',
    },
    {
      id: 'Interleukin.6..Mass.volume..in.Serum.or.Plasma',
      label: 'Interleukin 6 Mass volume in Serum or Plasma',
      type: 'Number',
    },
    {
      id: 'Leukocytes....volume..in.Blood',
      label: 'Leukocytes volume in Blood',
      type: 'Number',
    },
    {
      id: 'Lymph.nodes.with.macrometastases.....in.Cancer.specimen.by.Light.microscopy',
      label:
        'Lymph nodes with macrometastases in Cancer specimen by Light microscopy',
      type: 'Number',
    },
    {
      id: 'Lymph.nodes.with.micrometastases.....in.Cancer.specimen.by.Light.microscopy',
      label:
        'Lymph nodes with micrometastases in Cancer specimen by Light microscopy',
      type: 'Number',
    },
    {
      id: 'MCV..Entitic.volume.',
      label: 'MCV Entitic volume',
      type: 'Number',
    },
    {
      id: 'Platelets....volume..in.Blood',
      label: 'Platelets volume in Blood',
      type: 'Number',
    },
    {
      id: 'Abuse.Status..OMAHA.',
      label: 'Abuse Status OMAHA',
      type: 'Number',
    },
    {
      id: 'Allergy.to.animal.dander',
      label: 'Allergy to animal dander',
      type: 'Number',
    },
    {
      id: 'Allergy.to.bee.venom',
      label: 'Allergy to bee venom',
      type: 'Number',
    },
    {
      id: 'Allergy.to.dairy.foods',
      label: 'Allergy to dairy foods',
      type: 'Number',
    },
    {
      id: 'Allergy.to.dust.mite.protein',
      label: 'Allergy to dust mite protein',
      type: 'Number',
    },
    {
      id: 'Allergy.to.edible.egg',
      label: 'Allergy to edible egg',
      type: 'Number',
    },
    {
      id: 'Allergy.to.fish',
      label: 'Allergy to fish',
      type: 'Number',
    },
    {
      id: 'Allergy.to.grass.pollen',
      label: 'Allergy to grass pollen',
      type: 'Number',
    },
    {
      id: 'Allergy.to.latex',
      label: 'Allergy to latex',
      type: 'Number',
    },
    {
      id: 'Allergy.to.mold',
      label: 'Allergy to mold',
      type: 'Number',
    },
    {
      id: 'Allergy.to.nut',
      label: 'Allergy to nut',
      type: 'Number',
    },
    {
      id: 'Allergy.to.peanut',
      label: 'Allergy to peanut',
      type: 'Number',
    },
    {
      id: 'Allergy.to.shellfish',
      label: 'Allergy to shellfish',
      type: 'Number',
    },
    {
      id: 'Allergy.to.soy.protein',
      label: 'Allergy to soy protein',
      type: 'Number',
    },
    {
      id: 'Allergy.to.tree.pollen',
      label: 'Allergy to tree pollen',
      type: 'Number',
    },
    {
      id: 'Allergy.to.wheat',
      label: 'Allergy to wheat',
      type: 'Number',
    },
    {
      id: 'Are.you.covered.by.health.insurance.or.some.other.kind.of.health.care.plan..PhenX.',
      label:
        'Are you covered by health insurance or some other kind of health care plan PhenX',
      type: 'Number',
    },
    {
      id: 'Body.mass.index.30....obesity',
      label: 'Body mass index 30 obesity',
      type: 'Number',
    },
    {
      id: 'Body.mass.index.40....severely.obese',
      label: 'Body mass index 40 severely obese',
      type: 'Number',
    },
    {
      id: 'Burn.injury',
      label: 'Burn injury',
      type: 'Number',
    },
    {
      id: 'Cause.of.death..US.Standard.Certificate.of.Death.',
      label: 'Cause of death US Standard Certificate of Death',
      type: 'Number',
    },
    {
      id: 'History.of.appendectomy',
      label: 'History of appendectomy',
      type: 'Number',
    },
    {
      id: 'History.of.cardiac.arrest',
      label: 'History of cardiac arrest',
      type: 'Number',
    },
    {
      id: 'History.of.Hospitalizations.Outpatient.visits.Narrative',
      label: 'History of Hospitalizations Outpatient visits Narrative',
      type: 'Number',
    },
    {
      id: 'History.of.myocardial.infarction',
      label: 'History of myocardial infarction',
      type: 'Number',
    },
    {
      id: 'History.of.single.seizure',
      label: 'History of single seizure',
      type: 'Number',
    },
    {
      id: 'HIV.status',
      label: 'HIV status',
      type: 'Number',
    },
    {
      id: 'Housing.status',
      label: 'Housing status',
      type: 'Number',
    },
    {
      id: 'No.matching.concept',
      label: 'No matching concept',
      type: 'Number',
    },
    {
      id: 'Response.to.cancer.treatment',
      label: 'Response to cancer treatment',
      type: 'Number',
    },
    {
      id: 'Sexual.orientation',
      label: 'Sexual orientation',
      type: 'Number',
    },
    {
      id: 'Smokes.tobacco.daily',
      label: 'Smokes tobacco daily',
      type: 'Number',
    },
    {
      id: 'Suspected.disease.caused.by.2019.nCoV',
      label: 'Suspected disease caused by 2019 nCoV',
      type: 'Number',
    },
    {
      id: 'Suspected.lung.cancer',
      label: 'Suspected lung cancer',
      type: 'Number',
    },
    {
      id: 'Tobacco.smoking.status',
      label: 'Tobacco smoking status',
      type: 'Number',
    },
    {
      id: 'Total.score..MMSE.',
      label: 'Total score MMSE',
      type: 'Number',
    },
    {
      id: 'VR.12.Bodily.pain..BP..score...oblique.method',
      label: 'VR 12 Bodily pain BP score oblique method',
      type: 'Number',
    },
    {
      id: 'VR.12.General.health..GH..score...oblique.method',
      label: 'VR 12 General health GH score oblique method',
      type: 'Number',
    },
    {
      id: 'VR.12.Mental.health..MH..score...oblique.method',
      label: 'VR 12 Mental health MH score oblique method',
      type: 'Number',
    },
    {
      id: 'VR.12.Physical.functioning..PF..score...oblique.method',
      label: 'VR 12 Physical functioning PF score oblique method',
      type: 'Number',
    },
    {
      id: 'VR.12.Role.emotion..RE..score...oblique.method',
      label: 'VR 12 Role emotion RE score oblique method',
      type: 'Number',
    },
    {
      id: 'VR.12.Role.physical..RP..score...oblique.method',
      label: 'VR 12 Role physical RP score oblique method',
      type: 'Number',
    },
    {
      id: 'VR.12.Social.functioning..SF..score...oblique.method',
      label: 'VR 12 Social functioning SF score oblique method',
      type: 'Number',
    },
    {
      id: 'VR.12.Vitality..VT..score...oblique.method',
      label: 'VR 12 Vitality VT score oblique method',
      type: 'Number',
    },
    {
      id: 'date_of_birth',
      label: 'date_of_birth',
      type: 'Number',
    },
    {
      id: 'gender',
      label: 'gender',
      type: 'Number',
    },
    {
      id: 'race',
      label: 'race',
      type: 'Number',
    },
    {
      id: 'ethnicity',
      label: 'ethnicity',
      type: 'Number',
    },
    {
      id: 'omop_test',
      label: 'omop_test',
      type: 'Number',
    },
    {
      id: 'test',
      label: 'test',
      type: 'Number',
    },
    {
      id: 'sophia',
      label: 'sophia',
      type: 'Number',
    },
  ],
};

export default class DataShieldService implements IEngineService {
  headers = {};
  constructor(
    @Inject(ENGINE_MODULE_OPTIONS) private readonly options: IEngineOptions,
    private readonly httpService: HttpService,
    @Inject(REQUEST) private readonly req: Request,
  ) {}

  logout(): void {
    throw new Error('Method not implemented.');
  }

  getAlgorithms(): Algorithm[] | Promise<Algorithm[]> {
    throw new Error('Method not implemented.');
  }

  getHistogram(variable: string): RawResult {
    const path = this.options.baseurl + `quantiles?var=${variable}=combine`;
    const chart = {
      chart: {
        type: 'column',
      },
      legend: {
        enabled: false,
      },
      series: [
        {
          data: [
            14.1072, 14.9819, 16.4525, 20.568, 24.3793, 35.0674, 43.3755,
            22.4884,
          ],
          dataLabels: {
            enabled: true,
          },
        },
      ],
      title: {
        text: '',
      },
      tooltip: {
        enabled: false,
      },
      xAxis: {
        categories: ['5%', '10%', '25%', '50%', '75%', '90%', '95%', 'Mean'],
      },
      yAxis: {
        allowDecimals: false,
      },
    };

    return {
      rawdata: {
        data: chart,
        type: 'application/vnd.highcharts+json',
      },
    };
  }

  createExperiment(
    data: ExperimentCreateInput,
    isTransient: boolean,
  ): Experiment | Promise<Experiment> {
    if (data.algorithm.id === 'MULTIPLE_HISTOGRAMS') {
      return {
        id: `TRANSIENT-${Date.now()}`,
        variables: data.variables,
        name: data.name,
        domain: data.domain,
        datasets: data.datasets,
        algorithm: {
          id: data.algorithm.id,
        },
        results: data.variables.map((variable) => this.getHistogram(variable)),
      };
    }
    return {
      name: 'placeholder',
      algorithm: {
        id: 'placeholder',
      },
      datasets: [],
      variables: [],
      domain: '',
      id: 'placeholder',
    };
  }

  listExperiments(
    page: number,
    name: string,
  ): ListExperiments | Promise<ListExperiments> {
    return {
      totalExperiments: 0,
      experiments: [],
      totalPages: 0,
      currentPage: 0,
    };
  }

  getExperiment(id: string): Experiment | Promise<Experiment> {
    throw new Error('Method not implemented.');
  }

  removeExperiment(id: string): PartialExperiment | Promise<PartialExperiment> {
    throw new Error('Method not implemented.');
  }

  editExperient(
    id: string,
    expriment: ExperimentEditInput,
  ): Experiment | Promise<Experiment> {
    throw new Error('Method not implemented.');
  }

  async getDomains(): Promise<Domain[]> {
    const path = this.options.baseurl + 'start';

    /*const response = await firstValueFrom(
      this.httpService.get(path, {
        auth: { username: 'guest', password: 'guest123' },
      }),
    );

    console.log(response.headers, '\n', JSON.stringify(response.headers));

    //if (this.res) this.res.cookie('test', 'value');
    //else console.log(this.res);

    if (response.headers && response.headers['set-cookie']) {
      const cookies = response.headers['set-cookie'] as string[];
      cookies.forEach((cookie) => {
        const [key, value] = cookie.split(/={1}/);
        console.log('setting cookie: ', `key=${key}`, `value=${value}`);
        this.req.res.cookie(key, value, {
          httpOnly: true,
          sameSite: 'none',
          secure: true,
        });
      });
    }*/

    console.log(this.req['req'].headers);

    return [test];
    //return [transformToDomains.evaluate(response.data)];
  }

  getActiveUser(): string {
    const dummyUser = {
      username: 'anonymous',
      subjectId: 'anonymousId',
      fullname: 'anonymous',
      email: 'anonymous@anonymous.com',
      agreeNDA: true,
    };
    return JSON.stringify(dummyUser);
  }

  editActiveUser(): Observable<string> {
    throw new Error('Method not implemented.');
  }

  getExperimentREST(): Observable<string> {
    throw new Error('Method not implemented.');
  }

  deleteExperiment(): Observable<string> {
    throw new Error('Method not implemented.');
  }

  editExperimentREST(): Observable<string> {
    throw new Error('Method not implemented.');
  }

  startExperimentTransient(): Observable<string> {
    throw new Error('Method not implemented.');
  }

  startExperiment(): Observable<string> {
    throw new Error('Method not implemented.');
  }

  getExperiments(): string {
    return '[]';
  }

  getAlgorithmsREST(): string {
    return '[]';
  }
}
